// Homepage presentation copy and assets; full project content stays in projects.ts.
export const homepageProjects = [
  {
    slug: 'qeemat',
    label: 'Featured project',
    summary: 'A local-first price tracker for UAE shopping.',
    src: '/images/signal/qeemat-showcase.webp',
    width: 1200, height: 1100,
    alt: 'Qeemat concept presentation showing a product watchlist and price history.',
    caption: 'Product concept / Android',
  },
  {
    slug: 'layla-ai',
    label: 'AI beauty coach',
    brand: { src: '/images/signal/faces-logo.svg', width: 589, height: 165, alt: 'FACES' },
    summary: 'Personal beauty advice and in-chat shopping, built into the FACES app.',
    src: '/images/signal/layla-fragrance-showcase.webp',
    width: 1200, height: 900,
    mobile: { src: '/images/signal/layla-fragrance-mobile.webp', width: 800, height: 1067 },
    alt: 'Layla beauty coach recommending Tom Ford Ombré Leather and Armani Stronger With You Absolutely, with matching perfume bottles beside the phone.',
    caption: 'The beauty coach / FACES app',
  },
] as const
