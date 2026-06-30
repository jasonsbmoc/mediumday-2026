import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ACCENT_COLORS, GAP_PX } from '../../types'
import { mulberry32 } from '../../lib/random'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { SPEAKERS } from '../../data/speakers'
import { SpeakerCard } from '../SpeakerCard/SpeakerCard'
import styles from './Speakers.module.css'

const FRINGE_ROWS = 2

// A ragged, asymmetric cloud of cells extending the grid beyond the section's
// straight edge. Density is biased to one corner (top→left, bottom→right) and
// thins with distance from the core, so it reads like an organic cluster rather
// than a uniform row. A few stray cells appear elsewhere.
function Fringe({
  cols,
  edge,
  bias,
}: {
  cols: number
  edge: 'top' | 'bottom'
  bias: 'left' | 'right'
}) {
  const rows = useMemo(() => {
    const out: { present: boolean; color: string | null }[][] = []
    for (let rr = 0; rr < FRINGE_ROWS; rr++) {
      const distFromCore = edge === 'top' ? FRINGE_ROWS - 1 - rr : rr
      const rowFactor = 1 - distFromCore * 0.45 // outer rows sparser
      const cells = []
      for (let c = 0; c < cols; c++) {
        const seed =
          (((c + 1) * 73856093) ^
            ((rr + 1) * 19349663) ^
            (edge === 'top' ? 0xa11ce : 0xb0b)) >>>
          0
        const rng = mulberry32(seed)
        const t = cols <= 1 ? 0 : c / (cols - 1)
        const edgeDist = bias === 'left' ? t : 1 - t
        const base = edgeDist < 0.28 ? Math.max(0, 0.92 - edgeDist * 2.6) : 0.05
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
  }, [cols, edge, bias])

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
  const { cell, width } = useBreakpoint()
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
      <Fringe cols={cols} edge="top" bias="left" />

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
      <Fringe cols={cols} edge="bottom" bias="right" />
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
