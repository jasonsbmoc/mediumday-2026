import { useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './HeroRotator.module.css'

const INTERVAL_MS = 4200

// Each message is two lines (hard <br>), with a medium-weight emphasis lead-in.
const LINES: ReactNode[] = [
  <>
    <b>Over 100+ sessions</b> of deep
    <br />
    insights from writers and experts.
  </>,
  <>
    <b>Behind the scenes</b> of TK,
    <br />
    Medium’s new writing app.
  </>,
  <>
    <b>Live product demos</b> and writing
    <br />
    workshops with Medium staff.
  </>,
  <>
    <b>Live meetups</b> with Medium
    <br />
    writers and editors.
  </>,
]

export type HeroRotatorProps = {
  className?: string
}

/**
 * Cross-fades through a few two-line messages on a timer. All lines are stacked
 * in the same grid cell so the box reserves the tallest line's height (no layout
 * jump) and the outgoing/incoming lines dissolve into each other.
 */
export function HeroRotator({ className }: HeroRotatorProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((n) => (n + 1) % LINES.length),
      INTERVAL_MS,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`${styles.rotator} ${className ?? ''}`} aria-live="polite">
      {LINES.map((line, i) => (
        <p
          key={i}
          className={styles.line}
          style={{
            opacity: i === index ? 1 : 0,
            transition: reduced ? 'none' : undefined,
          }}
          aria-hidden={i === index ? undefined : true}
        >
          {line}
        </p>
      ))}
    </div>
  )
}
