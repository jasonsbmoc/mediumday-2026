// Editorial content — placeholder copy for first draft. Swap for real data.

export const EVENT = {
  date: 'September 18',
  // Hard break kept via `white-space: pre-line` in the hero styles.
  tagline: 'A live, free, virtual\ncommunity gathering.',
  ctaLabel: 'Register now',
  // Closing call-to-action above the footer.
  finalCtaLine: 'Join us on September 18',
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
    a: 'Medium Day is on September 18, 2026, held entirely online. Sessions run throughout the day across multiple tracks.',
  },
  {
    q: 'How much does it cost to attend?',
    a: 'Medium Day is free to attend. Registration gets you access to every session and the on-demand recordings afterward.',
  },
  {
    q: 'Do I need a Medium account?',
    a: 'A free Medium account lets you save sessions, follow speakers, and pick up where you left off — but anyone can register and watch.',
  },
  {
    q: 'Will sessions be recorded?',
    a: 'Yes. Registered attendees can revisit every talk on demand in the weeks following the event.',
  },
  {
    q: 'Can I speak or host a session?',
    a: 'Each year we open a call for speakers from the Medium community. Watch this page and your inbox for the submission window.',
  },
]
