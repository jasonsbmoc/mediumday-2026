import { memo } from 'react'
import styles from './ImageZone.module.css'

export type ImageZoneProps = {
  image: string
  /** member-cell bounding box in grid coordinates (0-based, inclusive) */
  minRow: number
  minCol: number
  rows: number
  cols: number
  cell: number // px per cell
  gap: number // px gridline gap between cells
  opacity: number
  durationMs: number
}

/**
 * The shared-photo layer for one image zone. Absolutely positioned to span the
 * exact pixel bounding box of its member cells (derived from member positions
 * by the parent), sitting *behind* the grid cells. A single <img> fills it via
 * object-fit: cover; the transparent member cells reveal it and the gridlines
 * paint on top. The whole zone fades as one unit.
 */
function ImageZoneImpl({
  image,
  minRow,
  minCol,
  rows,
  cols,
  cell,
  gap,
  opacity,
  durationMs,
}: ImageZoneProps) {
  const pitch = cell + gap // distance between adjacent cell origins
  return (
    <div
      className={styles.zone}
      style={{
        // span the bounding box including the 2px gaps between member cells
        left: minCol * pitch,
        top: minRow * pitch,
        width: cols * cell + (cols - 1) * gap,
        height: rows * cell + (rows - 1) * gap,
        opacity,
        transitionDuration: `${durationMs}ms`,
      }}
    >
      <img className={styles.img} src={image} alt="" aria-hidden="true" />
    </div>
  )
}

export const ImageZone = memo(ImageZoneImpl)
