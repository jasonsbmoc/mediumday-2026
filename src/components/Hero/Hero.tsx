import { useMemo } from 'react'
import { GridCloud } from '../GridCloud/GridCloud'
import { HeroRotator } from '../HeroRotator/HeroRotator'
import { Button } from '../Button/Button'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { buildCloud, HERO_PARAMS } from '../../data/heroLayouts'
import { GAP_PX } from '../../types'
import { EVENT } from '../../data/content'
import wordmark from '../../../assets/MD26-Logo.svg'
import styles from './Hero.module.css'

export function Hero() {
  const { breakpoint, cell, width } = useBreakpoint()
  const reducedMotion = useReducedMotion()

  const params = HERO_PARAMS[breakpoint]
  const pitch = cell + GAP_PX
  const cols = Math.ceil(width / pitch) + 2 // +2 to bleed past the right edge
  // Center column chosen so the carved clearing's CENTER (its left edge + half a
  // cell) lands on the viewport center — so the lockup, centered on the page,
  // sits dead-center of the clearing without any nudge.
  const centerCol = Math.round((width / 2 - cell / 2) / pitch)

  const layout = useMemo(
    () => buildCloud({ cols, centerCol, ...params }),
    [cols, centerCol, params],
  )

  return (
    <section className={styles.hero}>
      <div className={styles.cloudWrap}>
        <GridCloud
          key={`${cols}-${centerCol}`}
          layout={layout}
          cell={cell}
          animate={!reducedMotion}
        />
      </div>

      <div className={styles.lockup}>
        <img className={styles.wordmark} src={wordmark} alt="Medium Day" />
        <div className={styles.meta}>
          <span className={styles.date}>{EVENT.date}</span>
          <span className={styles.tagline}>{EVENT.tagline}</span>
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
        </div>
      </div>

      <HeroRotator className={styles.rotator} />
    </section>
  )
}
