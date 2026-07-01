import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ACCENT_COLORS, GAP_PX, type Breakpoint } from '../../types'
import { mulberry32 } from '../../lib/random'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { SPEAKERS } from '../../data/speakers'
import { SpeakerCard } from '../SpeakerCard/SpeakerCard'
import styles from './Speakers.module.css'

type FringeConfig = {
  rows: number // depth of the fringe (cells beyond the core edge)
  reach: number // how far from the biased edge cells stay dense (0..1)
  peak: number // density right at the biased corner
  slope: number // how fast density falls toward the far edge
  floor: number // stray-cell probability past `reach`
  falloff: number // per-row sparsening away from the core
  inset: number // pull the right-biased cluster in this many columns (the right
  // edge is clipped by overflow, so peaking at the very edge hides the cluster)
}

// The default barely shows at narrow widths (few columns → few dense cells), so
// mobile gets a deeper, denser fringe, and the right cluster is inset so it
// isn't lost in the clipped right edge.
const FRINGE_CONFIG: Record<'mobile' | 'default', FringeConfig> = {
  mobile: { rows: 2, reach: 0.3, peak: 1.1, slope: 1.3, floor: 0.2, falloff: 0.22, inset: 1 },
  default: { rows: 2, reach: 0.28, peak: 0.92, slope: 2.6, floor: 0.05, falloff: 0.45, inset: 0 },
}

// A ragged, asymmetric cloud of cells extending the grid beyond the section's
// straight edge. Density is biased to one corner (top→left, bottom→right) and
// thins with distance from the core, so it reads like an organic cluster rather
// than a uniform row. A few stray cells appear elsewhere.
function Fringe({
  cols,
  edge,
  bias,
  breakpoint,
}: {
  cols: number
  edge: 'top' | 'bottom'
  bias: 'left' | 'right'
  breakpoint: Breakpoint
}) {
  const rows = useMemo(() => {
    const cfg =
      breakpoint === 'mobile' ? FRINGE_CONFIG.mobile : FRINGE_CONFIG.default
    const out: { present: boolean; color: string | null }[][] = []
    for (let rr = 0; rr < cfg.rows; rr++) {
      const distFromCore = edge === 'top' ? cfg.rows - 1 - rr : rr
      const rowFactor = 1 - distFromCore * cfg.falloff // outer rows sparser
      const cells = []
      for (let c = 0; c < cols; c++) {
        const seed =
          (((c + 1) * 73856093) ^
            ((rr + 1) * 19349663) ^
            (edge === 'top' ? 0xa11ce : 0xb0b)) >>>
          0
        const rng = mulberry32(seed)
        // Distance (in columns) from the biased edge, with the right cluster
        // pulled inward so it lands on visible columns rather than the clipped
        // right edge.
        const edgeCol = bias === 'left' ? c : cols - 1 - c
        const adj = Math.max(0, edgeCol - (bias === 'right' ? cfg.inset : 0))
        const edgeDist = cols <= 1 ? 0 : adj / (cols - 1)
        const base =
          edgeDist < cfg.reach
            ? Math.max(cfg.floor, cfg.peak - edgeDist * cfg.slope)
            : cfg.floor
        const present = rng() < base * rowFactor
        const color =
          present && rng() < 0.16
            ? ACCENT_COLORS[Math.floor(rng() * ACCENT_COLORS.length)]
            : null
        cells.push({ present, color })
      }
      out.push(cells)
    }
    return out
  }, [cols, edge, bias, breakpoint])

  return (
    <div className={styles.fringe} aria-hidden="true">
      {rows.map((cells, rr) => (
        <div className={styles.fringeRow} key={rr}>
          {cells.map((s, c) => (
            <div
              key={c}
              className={s.present ? styles.fringeCell : styles.fringeGap}
              style={
                s.color ? { background: `var(--color-${s.color})` } : undefined
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Speakers() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { breakpoint, cell, width } = useBreakpoint()
  const cols = Math.ceil(width / (cell + GAP_PX)) + 1

  // Disable each control once the track reaches that end (prevents the no-op /
  // infinite-feeling presses, especially on touch).
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 1)
    setAtEnd(track.scrollLeft >= max - 1) // also true when content doesn't overflow
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    track.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      track.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges, cols])

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
    const step = card ? card.offsetWidth + gap : track.clientWidth * 0.8
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }, [])

  return (
    <section className={styles.section} aria-labelledby="speakers-heading">
      {/* organic top edge — cluster biased to the left */}
      <Fringe cols={cols} edge="top" bias="left" breakpoint={breakpoint} />

      <div className={styles.core}>
      {/* 1-cell-tall header row */}
      <div className={styles.headerBand}>
        <div className={styles.titleBlock}>
          <h2 id="speakers-heading" className={styles.heading}>
            Featured speakers
          </h2>
        </div>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Previous speakers"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Next speakers"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {SPEAKERS.map((s, i) => (
          <SpeakerCard key={s.slug} speaker={s} index={i} />
        ))}
      </div>

      {/* 1-cell-tall empty row */}
      <div className={styles.footerBand} aria-hidden="true" />
      </div>

      {/* organic bottom edge — cluster biased to the right */}
      <Fringe cols={cols} edge="bottom" bias="right" breakpoint={breakpoint} />
    </section>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
