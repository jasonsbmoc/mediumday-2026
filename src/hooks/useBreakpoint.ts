import { useEffect, useState } from 'react'
import { CELL_PX, type Breakpoint } from '../types'

function current(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w >= 1280) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}

const vw = () => (typeof window === 'undefined' ? 1280 : window.innerWidth)

// Reports the active breakpoint, its cell pixel size (kept in sync with the
// --cell custom property in global.css), and the viewport width — needed to
// size the full-bleed hero cloud and center its clearing.
export function useBreakpoint(): {
  breakpoint: Breakpoint
  cell: number
  width: number
} {
  const [state, setState] = useState(() => ({ bp: current(), w: vw() }))

  useEffect(() => {
    const onResize = () => setState({ bp: current(), w: vw() })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { breakpoint: state.bp, cell: CELL_PX[state.bp], width: state.w }
}
