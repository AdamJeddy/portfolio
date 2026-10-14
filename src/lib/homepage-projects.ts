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
    label: 'AI beauty assistant / FACES',
    summary: 'Personalized advice, product recommendations, and in-chat shopping.',
    src: '/images/signal/layla-premium-showcase.webp',
    width: 1200, height: 900,
    mobile: { src: '/images/signal/layla-premium-mobile.webp', width: 800, height: 1067 },
    alt: 'Layla beauty coach on an angled phone beside fragrance bottles, botanical details, and a stone display plinth.',
    caption: 'The beauty coach / FACES app',
  },
] as const
