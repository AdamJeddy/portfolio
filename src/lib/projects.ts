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
  note?: string
  year?: number
  icon?: string
  words: string[]
}

export const projects: ProjectItem[] = [
  {
    slug: 'layla-ai',
    title: 'Layla AI',
    description: 'The region’s first large-scale AI beauty assistant, built into the FACES app for personalized advice, product recommendations, and in-chat shopping.',
    details: [
      'Layla AI is the region’s first large-scale AI beauty assistant, built into the FACES app. Customers can chat for instant beauty advice, receive personalized product recommendations, and add products to their bag directly from the conversation. The experience spans skincare, makeup, fragrance, and haircare.',
      'I led the technical side of the project and its integration into the FACES app, helping turn the assistant into a customer-facing beauty shopping experience.',
    ],
    links: [
      {
        label: 'View on App Store',
        href: 'https://apps.apple.com/us/app/faces-beauty-%D9%81%D9%8A%D8%B3%D8%B2/id1531855095',
      },
      {
        label: 'View on Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.faces.androidapp',
      },
      {
        label: 'Read the launch story',
        href: 'https://www.chalhoubgroup.com/en/media/330/chalhoub-group-debuts-a-proprietary-generative-ai-engine-that-drives-25x-higher-conversions-and-reshapes-digital-beauty-retail-in-the-middle-east',
      },
    ],
    image: '/images/layla-ai/layla-ai-experience.webp',
    note: 'Work in progress — Layla recently received a UI facelift and a broader product update. I’ll be updating this page with the new experience soon.',
    year: 2025,
    words: [
      'beauty', 'assistant', 'chat', 'advice', 'recommendation', 'product', 'shopping',
      'personalized', 'fragrance', 'skincare', 'routine', 'discovery', 'catalog', 'bag',
      'commerce', 'customer', 'integration', 'mobile', 'FACES', 'AI',
    ],
  },
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
