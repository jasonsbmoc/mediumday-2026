import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button } from '../Button/Button'
import { EVENT } from '../../data/content'
import { GAP_PX, type AccentColor } from '../../types'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './FinalCta.module.css'

type Block = {
  id: number
  row: number
  col: number
  color: AccentColor
  strength: number // resting opacity (center full, neighbors faint)
  out: boolean
}
const FADE_MS = 450 // matches the .block transition in the CSS
const HOLD_MS = 90 // brief hold before a cell starts fading (so it pops first)

// Sporadic aura around the cursor cell (radius in cells). The center always
// lights; nearer cells are likelier and brighter, with the occasional far
// "stray" (à la the fringe floor) so it never feels like a fixed 3×3 block.
const AURA = {
  radius: 2,
  peakProb: 0.92, // present-probability near center, decaying with distance
  probSlope: 0.3,
  strayProb: 0.08, // floor probability for far cells
}

// Tan is weighted heavily so the vivid accents stay occasional and pop.
const TRAIL_COLORS: AccentColor[] = [
  'tan',
  'tan',
  'tan',
  'tan',
  'yellow',
  'green',
  'purple',
  'rust',
]

/**
 * Closing call-to-action above the footer: a single line in the hero rotator's
 * text style, with a Register button beside it.
 *
 * A cursor trail lights up cells on the shared grid lattice (snapped to the
 * same x=0 pitch as the rest of the site, no gridlines) in random accent
 * colors; each cell fades out as the cursor moves on.
 */
export function FinalCta() {
  const { cell } = useBreakpoint()
  const reduced = useReducedMotion()
  // Trail uses half-size cells (double the density) — its own lattice, not the
  // full-size site grid.
  const trailCell = cell / 2
  const pitch = trailCell + GAP_PX

  const [blocks, setBlocks] = useState<Block[]>([])
  const idRef = useRef(0)
  const cellRef = useRef<string | null>(null) // current cursor cell, to dedupe
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  // Spawn a sporadic aura at a cell; it holds briefly, then fades and is
  // removed on its own — so it clears even if the cursor stops moving.
  const spawnAt = useCallback((row: number, col: number) => {
    const cluster: Block[] = []
    for (let dr = -AURA.radius; dr <= AURA.radius; dr++) {
      for (let dc = -AURA.radius; dc <= AURA.radius; dc++) {
        const d = Math.abs(dr) + Math.abs(dc)
        const prob = d === 0 ? 1 : Math.max(AURA.strayProb, AURA.peakProb - d * AURA.probSlope)
        if (Math.random() >= prob) continue
        // Center stays solid; neighbors are much fainter so it stands out.
        const base = d === 0 ? 1 : Math.max(0.08, 0.32 - d * 0.09)
        const strength = base * (0.65 + Math.random() * 0.35) // jitter
        cluster.push({
          id: ++idRef.current,
          row: row + dr,
          col: col + dc,
          color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
          strength,
          out: false,
        })
      }
    }
    if (!cluster.length) return
    const ids = new Set(cluster.map((b) => b.id))
    setBlocks((list) => [...list, ...cluster])

    const hold = setTimeout(() => {
      timers.current.delete(hold)
      setBlocks((prev) => prev.map((b) => (ids.has(b.id) ? { ...b, out: true } : b)))
      const remove = setTimeout(() => {
        timers.current.delete(remove)
        setBlocks((prev) => prev.filter((b) => !ids.has(b.id)))
      }, FADE_MS)
      timers.current.add(remove)
    }, HOLD_MS)
    timers.current.add(hold)
  }, [])

  const handleMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (reduced) return
      const rect = e.currentTarget.getBoundingClientRect()
      const col = Math.floor((e.clientX - rect.left) / pitch)
      const row = Math.floor((e.clientY - rect.top) / pitch)
      const key = `${row}:${col}`
      if (cellRef.current === key) return // still in the same cell
      cellRef.current = key
      spawnAt(row, col)
    },
    [pitch, reduced, spawnAt],
  )

  const handleLeave = useCallback(() => {
    cellRef.current = null
  }, [])

  useEffect(() => {
    const set = timers.current
    return () => set.forEach(clearTimeout)
  }, [])

  return (
    <section
      className={styles.section}
      aria-label="Register"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.trail} aria-hidden="true">
        {blocks.map((b) => (
          <span
            key={b.id}
            className={styles.block}
            style={{
              left: b.col * pitch,
              top: b.row * pitch,
              width: trailCell,
              height: trailCell,
              backgroundColor: `var(--color-${b.color})`,
              opacity: b.out ? 0 : b.strength,
            }}
          />
        ))}
      </div>

      <p className={styles.line}>{EVENT.finalCtaLine}</p>
      <Button variant="primary" size="large" className={styles.cta}>
        {EVENT.ctaLabel}
        <svg
          className={styles.arrow}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </section>
  )
}
