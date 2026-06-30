import { useState } from 'react'
import { FAQ as FAQ_ITEMS } from '../../data/content'
import styles from './FAQ.module.css'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className={styles.heading}>
        Frequently asked
      </h2>
      <dl className={styles.list}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q} className={styles.item}>
              <dt>
                <button
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={styles.sign} aria-hidden="true">
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
              </dt>
              {isOpen && <dd className={styles.answer}>{item.a}</dd>}
            </div>
          )
        })}
      </dl>
    </section>
  )
}
