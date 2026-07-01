import { Button } from '../Button/Button'
import { EVENT } from '../../data/content'
import styles from './FinalCta.module.css'

/**
 * Closing call-to-action above the footer: a single line in the hero rotator's
 * text style, with a Register button beside it.
 */
export function FinalCta() {
  return (
    <section className={styles.section} aria-label="Register">
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
