// Featured speakers. Headshots live in assets/speakers/<slug>.jpg.

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
  { slug: 'cassie-mcdaniel', name: 'Cassie McDaniel', title: 'VP of Design, Medium' },
  { slug: 'zulie-rane', name: 'Zulie Rane', title: 'Senior Product Marketer, Medium' },
  { slug: 'brad-greenlee', name: 'Brad Greenlee', title: 'Principal Software Engineer, TK' },
  { slug: 'kassandra-mendes', name: 'Kassandra Mendes', title: 'Community Manager, Medium' },
  { slug: 'jason-combs', name: 'Jason Combs', title: 'Brand Design Lead, Medium' },
]

export const SPEAKERS: Speaker[] = ROSTER.map((s) => ({
  ...s,
  image: imageFor(s.slug),
}))
