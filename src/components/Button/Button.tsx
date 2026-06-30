import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

/**
 * PLACEHOLDER for Medium's existing Button component.
 *
 * Styled to read like Medium's primary button (black pill, white label) so the
 * design holds together for the prototype. When porting into the monorepo,
 * delete this folder and swap the import in the hero for the real `Button` —
 * the `variant` / `size` / standard button props are intentionally compatible.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'medium' | 'large'
}

export function Button({
  variant = 'primary',
  size = 'large',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  )
}
