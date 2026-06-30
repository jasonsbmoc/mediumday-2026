import { memo } from 'react'
import type { AccentColor, CellState } from '../../types'
import styles from './GridCell.module.css'

const ACCENT_VAR: Record<AccentColor, string> = {
  yellow: 'var(--color-yellow)',
  green: 'var(--color-green)',
  tan: 'var(--color-tan)',
  purple: 'var(--color-purple)',
  rust: 'var(--color-rust)',
}

export type GridCellProps = {
  state: CellState
  row: number // 0-based
  col: number // 0-based
  opacity: number
  /** transition duration in ms (200 ambient / 150 hover) */
  durationMs: number
  onHover?: (row: number, col: number) => void
}

/**
 * A single grid square. Four states (paper / clear / color / image). The 2px
 * gridline is an inset box-shadow — adjacent cells compose a shared 2px seam,
 * while cloud-edge cells get a 1px hairline. Image cells are transparent so the
 * ImageZone overlay behind them shows through; the gridline still paints on top.
 */
function GridCellImpl({
  state,
  row,
  col,
  opacity,
  durationMs,
  onHover,
}: GridCellProps) {
  const interactive = state.type === 'color' || state.type === 'image'

  return (
    <div
      className={`${styles.cell} ${styles[state.type]}`}
      data-type={state.type}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        opacity,
        transitionDuration: `${durationMs}ms`,
        backgroundColor:
          state.type === 'color' ? ACCENT_VAR[state.color] : undefined,
      }}
      onPointerEnter={
        interactive && onHover ? () => onHover(row, col) : undefined
      }
    />
  )
}

export const GridCell = memo(GridCellImpl)
