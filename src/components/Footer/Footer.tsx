import { FOOTER_LINKS } from '../../data/content'
import styles from './Footer.module.css'

/**
 * Paper-toned footer: a large Medium wordmark on the left (links back to
 * medium.com) with three columns of site links on the right.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a
          className={styles.brand}
          href="https://medium.com"
          aria-label="Medium — medium.com"
        >
          {/* Recolored via CSS mask (external SVGs in <img> can't take a fill),
              so it matches the link tone and darkens on hover. */}
          <span className={styles.logo} aria-hidden="true" />
        </a>

        <nav className={styles.columns} aria-label="Footer">
          {FOOTER_LINKS.map((col, i) => (
            <ul className={styles.column} key={i}>
              {col.map((link) => (
                <li key={link.label}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>
    </footer>
  )
}
