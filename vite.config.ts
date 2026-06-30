import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone prototype. Root is this folder; the existing `assets/` and `fonts/`
// directories are referenced directly via relative imports / CSS url().
//
// Deployed to GitHub Pages as a project site at /mediumday-2026/, so the build
// needs that base. Dev keeps a root base for a clean localhost URL.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/mediumday-2026/' : '/',
  plugins: [react()],
  server: { port: 5273, open: true },
}))
