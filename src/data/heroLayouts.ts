import {
  ACCENT_COLORS,
  type AccentColor,
  type Breakpoint,
  type CellState,
  type CloudLayout,
} from '../types'
import { mulberry32 } from '../lib/random'

/* ============================================================
   Responsive hero cloud, generated on the SAME left-anchored (x=0) lattice as
   the speaker section so vertical gridlines line up down the whole page.

   The cloud is built to span the viewport (cols ≈ viewport / pitch), anchored at
   the left edge. The open "clearing" the lockup sits in is carved around the
   viewport's center column (passed in as `centerCol`). Per-cell content is
   seeded by ABSOLUTE column/row index, so the texture is stable as the viewport
   resizes — only the carve shifts with the center.
   ============================================================ */

const SEED = 0x5eed01
const COLOR_PROBABILITY = 0.2

export type HeroParams = {
  maxRows: number
  topBand: number // solid rows across the full width
  openHalf: number // half-width (in cols) of the center clearing
  sideDepth: number // rows the outermost columns reach
}

// openHalf must stay in sync with --open-cells in Hero.module.css (2*openHalf+1).
export const HERO_PARAMS: Record<Breakpoint, HeroParams> = {
  desktop: { maxRows: 7, topBand: 2, openHalf: 4, sideDepth: 6.4 },
  tablet: { maxRows: 7, topBand: 2, openHalf: 5, sideDepth: 6 },
  mobile: { maxRows: 6, topBand: 2, openHalf: 2, sideDepth: 5 },
}

const u32 = (n: number) => n >>> 0
const cellSeed = (c: number, r: number) =>
  u32((c + 1) * 73856093) ^ u32((r + 1) * 19349663) ^ SEED
const colSeed = (c: number) => u32((c + 1) * 2654435761) ^ SEED

function rowDensity(r: number, topBand: number): number {
  if (r === 0) return 1 // solid top edge
  if (r < topBand) return 0.9 // light organic gaps within the band
  return Math.max(0.24, 0.82 - (r - topBand) * 0.13) // thin toward the bottom
}

export function buildCloud({
  cols,
  centerCol,
  maxRows,
  topBand,
  openHalf,
  sideDepth,
}: HeroParams & { cols: number; centerCol: number }): CloudLayout {
  // 2×2 image zones flanking the clearing on both sides, stepping outward — so
  // at least one photo is always in view (more on wider screens), not just at
  // the extreme edges. Placed in the top band (rows 0–1).
  const zoneOf = new Map<string, string>() // "r,c" -> zoneId
  const placeZone = (c: number): boolean => {
    if (c < 0 || c + 1 > cols - 1) return false // must fit 2 columns
    // Staggered vertical start (rows 0–1, 1–2, or 2–3), stable per column, so
    // photos sit on different planes rather than all in the top two rows.
    const r0 = Math.min(maxRows - 2, Math.floor(mulberry32(colSeed(c))() * 3))
    const id = `z${c}`
    for (let dr = 0; dr < 2; dr++)
      for (let dc = 0; dc < 2; dc++) zoneOf.set(`${r0 + dr},${c + dc}`, id)
    return true
  }
  for (let step = 0; step < 10; step++) {
    placeZone(centerCol + openHalf + 1 + step * 4) // right of the clearing
    placeZone(centerCol - openHalf - 2 - step * 4) // left of the clearing
  }

  // Per-column depth: clearing columns reach only the band; others ramp out.
  const depthOf = (c: number): number => {
    const d = Math.abs(c - centerCol)
    if (d <= openHalf) return topBand
    const ramp = topBand + (d - openHalf) * 0.85
    const jitter = (mulberry32(colSeed(c))() - 0.5) * 1.7
    return Math.min(sideDepth, ramp + jitter)
  }
  const depths = Array.from({ length: cols }, (_, c) => depthOf(c))

  const grid: CloudLayout = []
  for (let r = 0; r < maxRows; r++) {
    const row: (CellState | null)[] = []
    for (let c = 0; c < cols; c++) {
      const zid = zoneOf.get(`${r},${c}`)
      if (zid) {
        row.push({ type: 'image', zoneId: zid })
        continue
      }
      const rng = mulberry32(cellSeed(c, r))
      if (r >= depths[c] || rng() > rowDensity(r, topBand)) {
        row.push(null)
        continue
      }
      // No two color cells orthogonally adjacent (diagonal ok).
      const colorRoll = rng()
      const leftColor = row[c - 1]?.type === 'color'
      const upColor = grid[r - 1]?.[c]?.type === 'color'
      if (!leftColor && !upColor && colorRoll < COLOR_PROBABILITY) {
        const color = ACCENT_COLORS[
          Math.floor(rng() * ACCENT_COLORS.length)
        ] as AccentColor
        row.push({ type: 'color', color })
      } else {
        row.push({ type: 'paper' })
      }
    }
    grid.push(row)
  }
  return grid
}
