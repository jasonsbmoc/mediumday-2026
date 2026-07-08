// Featured speakers. Headshots live in assets/speakers/speaker-<slug>.jpg.

const headshots = import.meta.glob<string>(
  '../../assets/speakers/*.{jpg,jpeg,png}',
  { eager: true, query: '?url', import: 'default' },
)

// Match a file whose name contains "<slug>." (files are "speaker-<slug>.jpg").
function imageFor(slug: string): string | undefined {
  const key = Object.keys(headshots).find((p) => p.includes(`${slug}.`))
  return key ? headshots[key] : undefined
}

export type Speaker = {
  slug: string
  name: string
  title: string
  image?: string
}

// Tony first, then alternating Medium staff / featured writer.
const ROSTER: Omit<Speaker, 'image'>[] = [
  { slug: 'tony-stubblebine', name: 'Tony Stubblebine', title: 'CEO of Medium' },
  { slug: 'brad-greenlee', name: 'Brad Greenlee', title: 'Lead Engineer, TK' },
  { slug: 'ebony-walden', name: 'Ebony Walden', title: 'Author, Filmmaker, Storyteller & Global Citizen' },
  { slug: 'zulie-rane', name: 'Zulie Rane', title: 'Senior Product Marketer, Medium' },
  { slug: 'sam-vaseghi', name: 'Sam Vaseghi', title: 'Editor-in-Chief, The Quantastic Journal' },
  { slug: 'cameron-price', name: 'Cameron Price', title: 'Head of People, Medium' },
  { slug: 'emily-cook', name: 'Emily Cook', title: 'Dream Researcher, British Psychological Society' },
  { slug: 'amy-widdowson', name: 'Amy Widdowson', title: 'VP, Communications, Medium' },
  // Forced break + non-breaking hyphen so "Non‑Breaking Space" stays on its own line.
  { slug: 'michael-allen-nesmith', name: 'Michael Allen Nesmith', title: 'Founder, Creative Director,\nNon‑Breaking Space' },
  { slug: 'scott-lamb', name: 'Scott Lamb', title: 'VP, Content, Medium' },
  { slug: 'timothy-harmon', name: 'Timothy Harmon', title: 'Security & Data Governance Engineer' },
  { slug: 'deb-harman', name: 'Deb Harman', title: 'Founder, The Narrative Arc, The Wind Phone, Imogene’s Notebook' },
]

export const SPEAKERS: Speaker[] = ROSTER.map((s) => ({
  ...s,
  image: imageFor(s.slug),
}))
