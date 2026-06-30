// Featured speakers. Headshots live in assets/speakers/<slug>.jpg.
// Titles are PLACEHOLDER pending real copy — only the names + photos are real.

const headshots = import.meta.glob<string>(
  '../../assets/speakers/*.{jpg,jpeg,png}',
  { eager: true, query: '?url', import: 'default' },
)

function imageFor(slug: string): string | undefined {
  const key = Object.keys(headshots).find((p) => p.includes(`/${slug}.`))
  return key ? headshots[key] : undefined
}

export type Speaker = {
  slug: string
  name: string
  title: string
  image?: string
}

const ROSTER: Omit<Speaker, 'image'>[] = [
  { slug: 'tony-stubblebine', name: 'Tony Stubblebine', title: 'CEO of Medium' },
  { slug: 'cassie-mcdaniel', name: 'Cassie McDaniel', title: 'Design · TK' },
  { slug: 'zulie-rane', name: 'Zulie Rane', title: 'Writer · TK' },
  { slug: 'brad-greenlee', name: 'Brad Greenlee', title: 'Engineering · TK' },
  { slug: 'kassandra-mendes', name: 'Kassandra Mendes', title: 'Writer · TK' },
  { slug: 'jason-combs', name: 'Jason Combs', title: 'Design · TK' },
]

export const SPEAKERS: Speaker[] = ROSTER.map((s) => ({
  ...s,
  image: imageFor(s.slug),
}))
