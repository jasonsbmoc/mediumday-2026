import { memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  ACCENT_COLORS,
  GAP_PX,
  type AccentColor,
  type CloudLayout,
} from '../../types'
import { IMAGE_LIBRARY } from '../../data/imageLibrary'
import { pickDifferent } from '../../lib/random'
import { GridCell } from '../GridCell/GridCell'
import { ImageZone } from '../ImageZone/ImageZone'
import styles from './GridCloud.module.css'

const MAX_CONCURRENT = 2 // max ambient swaps processed per tick
const TICK_MS = 400
const REVERT_MS = 2000 // hovered origin re-enters the pool after ~2s
// Per-element idle between transitions. Long + jittered so the grid feels
// calm and ambient rather than busy (especially now that it's full-width).
const IDLE_MIN = 6000
const IDLE_MAX = 13000

const cellKey = (r: number, c: number) => `${r}:${c}`
const zoneKey = (id: string) => `zone:${id}`
const rand = (min: number, max: number) => min + Math.random() * (max - min)

type ZoneBox = {
  minRow: number
  minCol: number
  maxRow: number
  maxCol: number
}

export type GridCloudProps = {
  layout: CloudLayout
  cell: number // px per cell at the current breakpoint
  animate: boolean // false under prefers-reduced-motion
  className?: string
}

/** Derive each zone's member bounding box from the static layout (zones are fixed). */
function deriveZones(layout: CloudLayout): Map<string, ZoneBox> {
  const zones = new Map<string, ZoneBox>()
  layout.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell?.type !== 'image') return
      const z = zones.get(cell.zoneId)
      if (!z) {
        zones.set(cell.zoneId, { minRow: r, minCol: c, maxRow: r, maxCol: c })
      } else {
        z.minRow = Math.min(z.minRow, r)
        z.minCol = Math.min(z.minCol, c)
        z.maxRow = Math.max(z.maxRow, r)
        z.maxCol = Math.max(z.maxCol, c)
      }
    }),
  )
  return zones
}

/** Assign each zone a starting image; no two zones share one (brief rule). */
function initialZoneImages(zoneIds: string[]): Map<string, string> {
  const used = new Set<string>()
  const map = new Map<string, string>()
  for (const id of zoneIds) {
    const pool = IMAGE_LIBRARY.filter((i) => !used.has(i))
    const img = pool[Math.floor(Math.random() * pool.length)] ?? IMAGE_LIBRARY[0]
    map.set(id, img)
    used.add(img)
  }
  return map
}

function GridCloudImpl({ layout, cell, animate, className }: GridCloudProps) {
  const cols = useMemo(
    () => layout.reduce((m, row) => Math.max(m, row.length), 0),
    [layout],
  )
  const zones = useMemo(() => deriveZones(layout), [layout])
  const zoneIds = useMemo(() => [...zones.keys()], [zones])

  const [cells, setCells] = useState<CloudLayout>(() =>
    layout.map((row) => row.slice()),
  )
  const [zoneImages, setZoneImages] = useState<Map<string, string>>(() =>
    initialZoneImages(zoneIds),
  )
  // Refs mirror state for the scheduler (which runs outside React's render).
  const cellsRef = useRef(cells)
  const zoneImagesRef = useRef(zoneImages)
  cellsRef.current = cells
  zoneImagesRef.current = zoneImages

  // Shared between scheduler and hover so they don't collide on the same key.
  // The scheduler effect repoints these at its own local sets on (re)mount.
  const hoverLockRef = useRef<Set<string>>(new Set())
  const activeRef = useRef<Set<string>>(new Set())

  const mutateCells = (fn: (draft: CloudLayout) => void) => {
    const next = cellsRef.current.map((row) => row.slice())
    fn(next)
    cellsRef.current = next
    setCells(next)
  }

  const setZoneImage = (id: string, img: string) => {
    const next = new Map(zoneImagesRef.current)
    next.set(id, img)
    zoneImagesRef.current = next
    setZoneImages(next)
  }

  // ---- Ambient animation scheduler ----
  useEffect(() => {
    if (!animate) return

    const nextFire = new Map<string, number>()
    const active = new Set<string>() // counts toward MAX_CONCURRENT
    const hoverLock = new Set<string>() // hover-held keys (off the ambient budget)
    const timers = new Set<ReturnType<typeof setTimeout>>()
    hoverLockRef.current = hoverLock
    activeRef.current = active

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t)
        fn()
      }, ms)
      timers.add(t)
      return t
    }

    const currentColorKeys = () => {
      const keys: { key: string; r: number; c: number }[] = []
      cellsRef.current.forEach((row, r) =>
        row.forEach((st, c) => {
          if (st?.type === 'color') keys.push({ key: cellKey(r, c), r, c })
        }),
      )
      return keys
    }

    const runTransition = (key: string) => {
      active.add(key)
      // Instant swap — no fade (the fade read as an awkward "empty" flash).
      if (key.startsWith('zone:')) {
        const id = key.slice(5)
        const cur = zoneImagesRef.current.get(id)
        const usedByOthers = new Set(
          [...zoneImagesRef.current.entries()]
            .filter(([zid]) => zid !== id)
            .map(([, img]) => img),
        )
        const pool = IMAGE_LIBRARY.filter(
          (i) => i !== cur && !usedByOthers.has(i),
        )
        const fallback = IMAGE_LIBRARY.filter((i) => i !== cur)
        const choices = pool.length ? pool : fallback
        if (choices.length) {
          setZoneImage(id, choices[Math.floor(Math.random() * choices.length)])
        }
      } else {
        const [r, c] = key.split(':').map(Number)
        const st = cellsRef.current[r]?.[c]
        if (st?.type === 'color') {
          const next = pickDifferent<AccentColor>(ACCENT_COLORS, st.color)
          mutateCells((d) => {
            d[r][c] = { type: 'color', color: next }
          })
        }
      }
      later(() => {
        active.delete(key)
        nextFire.set(key, performance.now() + rand(IDLE_MIN, IDLE_MAX))
      }, 0)
    }

    const tick = () => {
      const now = performance.now()
      const colorKeys = currentColorKeys().map((u) => u.key)
      const units = new Set<string>([...colorKeys, ...zoneIds.map(zoneKey)])

      // seed timers for new units; prune vanished ones
      units.forEach((k) => {
        if (!nextFire.has(k)) nextFire.set(k, now + rand(IDLE_MIN, IDLE_MAX))
      })
      for (const k of [...nextFire.keys()]) {
        if (!units.has(k)) {
          nextFire.delete(k)
          active.delete(k)
        }
      }

      for (const k of units) {
        if (active.size >= MAX_CONCURRENT) break
        if (active.has(k) || hoverLock.has(k)) continue
        const due = nextFire.get(k) ?? Infinity
        if (due <= now) runTransition(k)
      }
    }

    const interval = setInterval(tick, TICK_MS)
    return () => {
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [animate, zoneIds])

  // ---- Hover interaction ----
  const handleHover = (r: number, c: number) => {
    if (!animate) return
    const origin = cellsRef.current[r]?.[c]
    if (origin?.type !== 'color') return // image-cell hover: left subtle (no relocation)

    const key = cellKey(r, c)
    if (activeRef.current.has(key) || hoverLockRef.current.has(key)) return

    // Relocate to a random paper cell anywhere in the cloud that wouldn't end up
    // orthogonally adjacent to another color cell (the origin is leaving, so it
    // doesn't count). Diagonal neighbors are fine.
    const cells = cellsRef.current
    const candidates: [number, number][] = []
    for (let rr = 0; rr < cells.length; rr++) {
      for (let cc = 0; cc < cells[rr].length; cc++) {
        if (cells[rr][cc]?.type !== 'paper') continue
        if (rr === r && cc === c) continue
        const touchesColor = (
          [
            [rr - 1, cc],
            [rr + 1, cc],
            [rr, cc - 1],
            [rr, cc + 1],
          ] as [number, number][]
        ).some(
          ([ar, ac]) =>
            !(ar === r && ac === c) && cells[ar]?.[ac]?.type === 'color',
        )
        if (!touchesColor) candidates.push([rr, cc])
      }
    }
    if (!candidates.length) return

    const [nr, nc] = candidates[Math.floor(Math.random() * candidates.length)]
    const color = origin.color
    const targetKey = cellKey(nr, nc)
    hoverLockRef.current.add(key)
    hoverLockRef.current.add(targetKey)

    // Instant move — no fade.
    mutateCells((d) => {
      d[r][c] = { type: 'paper' } // origin reverts to paper
      d[nr][nc] = { type: 'color', color } // reappears elsewhere on the grid
    })
    // origin + target re-enter the pool after ~2s
    setTimeout(() => {
      hoverLockRef.current.delete(key)
      hoverLockRef.current.delete(targetKey)
    }, REVERT_MS)
  }

  return (
    <div
      className={`${styles.cloud} ${className ?? ''}`}
      style={{ ['--cols' as string]: cols }}
    >
      {zoneIds.map((id) => {
        const box = zones.get(id)!
        const img = zoneImages.get(id)
        if (!img) return null
        return (
          <ImageZone
            key={id}
            image={img}
            minRow={box.minRow}
            minCol={box.minCol}
            rows={box.maxRow - box.minRow + 1}
            cols={box.maxCol - box.minCol + 1}
            cell={cell}
            gap={GAP_PX}
            opacity={1}
            durationMs={0}
          />
        )
      })}
      {cells.map((row, r) =>
        row.map((st, c) => {
          if (!st) return null
          return (
            <GridCell
              key={cellKey(r, c)}
              state={st}
              row={r}
              col={c}
              opacity={1}
              durationMs={0}
              onHover={animate ? handleHover : undefined}
            />
          )
        }),
      )}
    </div>
  )
}

export const GridCloud = memo(GridCloudImpl)
