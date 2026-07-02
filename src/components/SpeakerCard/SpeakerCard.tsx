import { useMemo } from 'react'
import { ACCENT_COLORS, type AccentColor } from '../../types'
import { mulberry32 } from '../../lib/random'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import type { Speaker } from '../../data/speakers'
import styles from './SpeakerCard.module.css'

const ACCENT_VAR: Record<AccentColor, string> = {
  yellow: 'var(--color-yellow)',
  green: 'var(--color-green)',
  tan: 'var(--color-tan)',
  purple: 'var(--color-purple)',
  rust: 'var(--color-rust)',
}

export type SpeakerCardProps = {
  speaker: Speaker
  index: number // seeds the two accent cells so they're stable per card
}

/**
 * One carousel card on a tight grid of touching cells (2px gridlines):
 *   · 3×3 headshot (grayscale, fades to full color on hover)
 *   · name card below (1 row; 2 rows on mobile, where longer titles wrap)
 *   · 2-wide column of paper cells to the right, two a random accent color
 *
 * Mobile grows the card a row taller (see the module CSS media query), so the
 * right column needs 10 accent cells there instead of 8.
 */
export function SpeakerCard({ speaker, index }: SpeakerCardProps) {
  const { breakpoint } = useBreakpoint()
  const rightCells = breakpoint === 'mobile' ? 10 : 8 // 2 cols × rows beside the headshot/name

  // Pick two right-cells and give each a random accent color. Stable per card
  // (seeded), but — like the hero grid — the two must not be orthogonally
  // adjacent, so fixed colors never read as a touching 2-cell blob. The cells
  // auto-flow into a 2-col block: index i → row floor(i/2), col i%2.
  const accents = useMemo(() => {
    const rng = mulberry32((index + 1) * 0x9e3779b1)
    const rowOf = (i: number) => Math.floor(i / 2)
    const colOf = (i: number) => i % 2
    const orthoAdjacent = (a: number, b: number) =>
      Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1

    const first = Math.floor(rng() * rightCells)
    const candidates: number[] = []
    for (let i = 0; i < rightCells; i++) {
      if (i !== first && !orthoAdjacent(first, i)) candidates.push(i)
    }
    const second = candidates[Math.floor(rng() * candidates.length)]

    const map = new Map<number, AccentColor>()
    for (const i of [first, second]) {
      map.set(i, ACCENT_COLORS[Math.floor(rng() * ACCENT_COLORS.length)])
    }
    return map
  }, [index, rightCells])

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

      {Array.from({ length: rightCells }, (_, i) => {
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
