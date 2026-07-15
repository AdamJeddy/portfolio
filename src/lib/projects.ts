export interface ProjectItem {
  slug: string
  title: string
  description: string
  body?: string
  tech: string[]
  github: string
  live?: string
  image?: string
  role?: string
  year?: number
  icon?: string
  words: string[]
}

export const projects: ProjectItem[] = [
  {
    slug: 'qeemat',
    title: 'Qeemat',
    description: 'Android-first, local-first price tracker for UAE shopping sites with background checks and notifications.',
    body: 'Qeemat is a React Native + TypeScript price tracking app built for UAE shoppers. Add a product URL from supported stores — Noon, Nike UAE, Sun & Sand Sports, Level Shoes, Ounass, and more — and Qeemat tracks prices locally on-device with AsyncStorage, Android WorkManager background checks, and local notifications for price drops. No backend, no accounts, no cloud sync. Just a focused tool that respects your data.',
    tech: ['React Native', 'TypeScript', 'Kotlin', 'AsyncStorage', 'WorkManager', 'Jest'],
    github: 'https://github.com/AdamJeddy/Qeemat',
    role: 'Independent product',
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
