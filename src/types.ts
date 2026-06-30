// ---- Core grid data contract (from brief) ----

export type AccentColor = 'yellow' | 'green' | 'tan' | 'purple' | 'rust'

export const ACCENT_COLORS: AccentColor[] = [
  'yellow',
  'green',
  'tan',
  'purple',
  'rust',
]

export type CellState =
  | { type: 'paper' }
  | { type: 'clear' }
  | { type: 'color'; color: AccentColor }
  | { type: 'image'; zoneId: string }

export type ImageZone = {
  id: string
  image: string // asset path; bounding box is derived at render time from member cells
}

// A cloud layout is a 2D array. `null` = void (no cell rendered → white space).
export type CloudLayout = (CellState | null)[][]

// Cell pixel size per breakpoint — must match --cell in global.css.
export const CELL_PX = { mobile: 46, tablet: 66, desktop: 84 } as const
export type Breakpoint = keyof typeof CELL_PX

// Gridline gap between cells, in px (must match --gap in global.css).
export const GAP_PX = 2
