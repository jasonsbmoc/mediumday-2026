# Medium Day 2026

Landing page prototype for **Medium Day** — a live, free, virtual community gathering on **September 18, 2026**.

🔗 **Live demo:** https://jasonsbmoc.github.io/mediumday-2026/

Built around a modular paper-toned grid system: hairline gridlines, color-fill accent cells, and image zones that reveal nature photography across adjacent cells. Below the hero are a featured-speakers carousel and an FAQ accordion.

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- CSS Modules
- Söhne (loaded locally via `@font-face`)

## Development

```bash
npm install
npm run dev      # http://localhost:5273
```

## Build

```bash
npm run build    # type-checks, then outputs to dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `main` triggers a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that builds the site and publishes it to GitHub Pages.
