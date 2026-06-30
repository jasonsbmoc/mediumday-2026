import { useMemo } from 'react'
import { ACCENT_COLORS, type AccentColor } from '../../types'
import { mulberry32 } from '../../lib/random'
import type { Speaker } from '../../data/speakers'
import styles from './SpeakerCard.module.css'

const ACCENT_VAR: Record<AccentColor, string> = {
  yellow: 'var(--color-yellow)',
  green: 'var(--color-green)',
  tan: 'var(--color-tan)',
  purple: 'var(--color-purple)',
  rust: 'var(--color-rust)',
}

const RIGHT_CELLS = 8 // 2 cols × 4 rows beside the headshot/name

export type SpeakerCardProps = {
  speaker: Speaker
  index: number // seeds the two accent cells so they're stable per card
}

/**
 * One carousel card on a tight 5×4 grid of touching cells (2px gridlines):
 *   · 3×3 headshot (grayscale, fades to full color on hover)
 *   · 3×1 name card below
 *   · 2×4 column of paper cells to the right, two of them a random accent color
 */
export function SpeakerCard({ speaker, index }: SpeakerCardProps) {
  // Pick two right-cells and give each a random accent color. Stable per card
  // (seeded), but — like the hero grid — the two must not be orthogonally
  // adjacent, so fixed colors never read as a touching 2-cell blob. The 8 cells
  // auto-flow into a 4-row × 2-col block: index i → row floor(i/2), col i%2.
  const accents = useMemo(() => {
    const rng = mulberry32((index + 1) * 0x9e3779b1)
    const rowOf = (i: number) => Math.floor(i / 2)
    const colOf = (i: number) => i % 2
    const orthoAdjacent = (a: number, b: number) =>
      Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1

    const first = Math.floor(rng() * RIGHT_CELLS)
    const candidates: number[] = []
    for (let i = 0; i < RIGHT_CELLS; i++) {
      if (i !== first && !orthoAdjacent(first, i)) candidates.push(i)
    }
    const second = candidates[Math.floor(rng() * candidates.length)]

    const map = new Map<number, AccentColor>()
    for (const i of [first, second]) {
      map.set(i, ACCENT_COLORS[Math.floor(rng() * ACCENT_COLORS.length)])
    }
    return map
  }, [index])

  return (
    <article className={styles.card}>
      <div className={styles.headshot}>
        {speaker.image ? (
          <img src={speaker.image} alt={speaker.name} />
        ) : (
          <div className={styles.headshotFallback} aria-hidden="true" />
        )}
      </div>

      <div className={styles.name}>
        <span className={styles.nameText}>{speaker.name}</span>
        <span className={styles.title}>{speaker.title}</span>
      </div>

      {Array.from({ length: RIGHT_CELLS }, (_, i) => {
        const accent = accents.get(i)
        return (
          <div
            key={i}
            className={styles.cell}
            style={
              accent ? { backgroundColor: ACCENT_VAR[accent] } : undefined
            }
          />
        )
      })}
    </article>
  )
}
