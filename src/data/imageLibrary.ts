// Image library — textural/nature photography revealed through image zones.
// Pulled directly from the repo's existing asset bank via Vite glob import.
// Replace/curate freely; the array is the single source of truth.

const modules = import.meta.glob<string>('../../assets/images/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const IMAGE_LIBRARY: string[] = Object.keys(modules)
  .sort()
  .map((k) => modules[k])

if (IMAGE_LIBRARY.length === 0) {
  // Fail loud in dev if the asset folder moved — zones need at least a few images.
  console.warn('[imageLibrary] No images found under assets/images/')
}
