export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectItem {
  slug: string
  title: string
  description: string
  details?: string[]
  links: ProjectLink[]
  image?: string
  year?: number
  icon?: string
  words: string[]
}

export const projects: ProjectItem[] = [
  {
    slug: 'qeemat',
    title: 'Qeemat',
    description: 'Android-first, local-first price tracker for UAE shopping sites with background checks and notifications.',
    details: [
      'Qeemat is a React Native + TypeScript price tracking app built for UAE shoppers. Add a product URL from supported stores — Noon, Nike UAE, Sun & Sand Sports, Level Shoes, Ounass, and more — and Qeemat tracks prices locally on-device with AsyncStorage, Android WorkManager background checks, and local notifications for price drops.',
      'There is no backend, account, or cloud sync. It is a focused tool that keeps product and price data on the device.',
    ],
    links: [
      { label: 'View code', href: 'https://github.com/AdamJeddy/Qeemat' },
    ],
    year: 2026,
    icon: '◆',
    words: [
      'price', 'track', 'scan', 'check', 'notify', 'local', 'offline', 'store', 'product', 'snapshot',
      'history', 'drop', 'alert', 'background', 'parse', 'fetch', 'currency', 'AED', 'UAE', 'noon',
      'nike', 'ounass', 'amazon', 'favorite', 'watchlist', 'activity', 'schedule', 'permission',
    ],
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}
