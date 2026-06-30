// Seeded deterministic PRNG (mulberry32). Used so cloud shape + cell-state
// assignment are stable across re-renders and reloads (brief: "seeded
// deterministic shuffle, so the layout does not re-randomize on re-render").

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Pick a random element using a provided rng (0..1). */
export function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Pick a random element that is not `exclude` (no immediate repeat). */
export function pickDifferent<T>(
  arr: readonly T[],
  exclude: T,
  rng: () => number = Math.random,
): T {
  if (arr.length <= 1) return arr[0]
  let next = pick(arr, rng)
  while (next === exclude) next = pick(arr, rng)
  return next
}
