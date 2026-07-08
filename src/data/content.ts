// Editorial content — placeholder copy for first draft. Swap for real data.

export const EVENT = {
  date: 'September 18',
  // Hard break kept via `white-space: pre-line` in the hero styles.
  tagline: 'A live, free, virtual\ncommunity gathering.',
  ctaLabel: 'Register now',
  // Closing call-to-action above the footer (the event tagline).
  finalCtaLine: 'Discover something.',
}

// Speaker data now lives in ./speakers.ts (backed by assets/speakers/).

// Footer link columns. Placeholder hrefs (real Medium URLs) — routing gets
// wired up for real once this lands in the monorepo.
export type FooterLink = { label: string; href: string }

export const FOOTER_LINKS: FooterLink[][] = [
  [
    { label: 'About', href: 'https://medium.com/about' },
    { label: 'Membership', href: 'https://medium.com/membership' },
    { label: 'Start reading', href: 'https://medium.com/' },
  ],
  [
    { label: 'Careers', href: 'https://medium.com/jobs-at-medium' },
    { label: 'Press', href: 'https://blog.medium.com/' },
    { label: 'Blog', href: 'https://blog.medium.com/' },
    { label: 'Store', href: 'https://medium.myshopify.com/' },
  ],
  [
    { label: 'Help', href: 'https://help.medium.com/' },
    { label: 'Privacy', href: 'https://policy.medium.com/medium-privacy-policy-f03bf92035c9' },
    { label: 'Rules', href: 'https://policy.medium.com/medium-rules-30e5502c4eb4' },
    { label: 'Terms', href: 'https://policy.medium.com/medium-terms-of-service-9db0094a1e0f' },
  ],
]

export type FaqItem = { q: string; a: string }

export const FAQ: FaqItem[] = [
  {
    q: 'When and where is Medium Day?',
    a: 'Medium Day is on September 18, 2026, held entirely on Zoom. Sessions run throughout the day across multiple tracks.',
  },
  {
    q: 'How much does it cost to attend?',
    a: 'Medium Day is free to attend. Registration gets you access to general sessions and the on-demand recordings afterward. Select sessions will require a Friend of Medium membership — more details coming soon.',
  },
  {
    q: 'Do I need a Zoom account?',
    a: 'Yes. Sign up for a free Zoom account using your Medium email address to register and save Medium Day sessions.',
  },
  {
    q: 'What can I expect at Medium Day?',
    a: 'A full day of virtual sessions across four tracks: Craft (become a better writer), Perspectives (learn from real experts), Platform (get more out of Medium), and Community (meet your people). Whether you’re a longtime writer or reader on Medium, there’s something for you to discover. And stay tuned for an exclusive fifth track coming soon!',
  },
  {
    q: 'Can I speak or host a session?',
    a: 'Each year, we open a call for speakers from the Medium community. This year’s speaker applications are now closed. If you’d like to participate in our next Medium Day, watch your inbox for 2027’s Call for Speakers.',
  },
]
