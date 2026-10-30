export interface LaylaScreen {
  label: string
  title: string
  description: string
  src: string
  width: number
  height: number
  alt: string
}

export const laylaProductFlow = [
  {
    number: '01',
    title: 'Context',
    description:
      'Layla starts with a customer’s preferences, skin needs, and the products already in their routine.',
  },
  {
    number: '02',
    title: 'Guidance',
    description:
      'The conversation becomes a tailored recommendation, available in chat, search, and product pages.',
  },
  {
    number: '03',
    title: 'Action',
    description:
      'Shoppable cards, offers, samples, and checkout keep useful advice connected to the next step.',
  },
] as const

export const laylaEditorialHero = {
  src: '/images/layla-showcase/layla-editorial-hero-v1.png',
  width: 1536,
  height: 1024,
  alt: 'Editorial Layla visual with a beauty-shopping phone, fragrance vessel, serum bottle, and green foliage.',
}

export const laylaPassportOverview: LaylaScreen = {
  label: 'Beauty Passport',
  title: 'A better starting point than a blank search field.',
  description:
    'The profile gives Layla a practical view of someone’s skin, scent preferences, and beauty shelf before the next recommendation begins.',
  src: '/images/layla-showcase/beauty-passport.jpg',
  width: 1440,
  height: 3013,
  alt: 'Layla Beauty Passport in the FACES app showing scent profile, skin score, and a beauty shelf.',
}

export const laylaPassportFeatures: LaylaScreen[] = [
  {
    label: 'Scent Profile',
    title: 'Turn taste into a fragrance language.',
    description:
      'A short quiz gives the assistant a shared vocabulary for notes, families, and the styles a customer is likely to enjoy.',
    src: '/images/layla-showcase/scent-profile.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla scent profile screen listing a shopper’s fragrance preferences and top notes.',
  },
  {
    label: 'Skin Score',
    title: 'Make skincare recommendations more considered.',
    description:
      'A selfie-led assessment and follow-up inputs create a score that can be tracked over time, with a clearer basis for product guidance.',
    src: '/images/layla-showcase/skin-score.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla skin score screen showing combination skin, a score, and detailed factors.',
  },
]

export const laylaCommerceLead: LaylaScreen = {
  label: 'Personalised discovery',
  title: 'A feed shaped by the customer, not a campaign calendar.',
  description:
    'Dynamic product cards respond to the customer’s conversation and Beauty Passport, helping the next recommendation feel more timely.',
  src: '/images/layla-showcase/personalised-feed.jpg',
  width: 1440,
  height: 2992,
  alt: 'Layla showing a personalised FACES product feed with beauty preference filters and sunscreen cards.',
}

export const laylaCommerceActions: LaylaScreen[] = [
  {
    label: 'Conversational commerce',
    title: 'Explain the recommendation, then make it shoppable.',
    description:
      'Product cards arrive in the conversation with a reason to consider them, helpful offers, and free samples shown alongside the choice.',
    src: '/images/layla-showcase/in-chat-recommendations.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla fragrance recommendation with a shoppable product card, an offer, and free samples.',
  },
  {
    label: 'Fast checkout',
    title: 'Keep the moment of intent intact.',
    description:
      'A customer can move from a recommendation to standard checkout in the chat; on iOS, Apple Pay makes that step even faster.',
    src: '/images/layla-showcase/in-chat-checkout.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla conversational checkout screen with products in bag and a standard checkout action.',
  },
]

export const laylaEntryPoints: LaylaScreen[] = [
  {
    label: 'Search',
    title: 'A question can start in search.',
    description:
      'The search experience provides a direct way to ask Layla for help when browsing alone is not enough.',
    src: '/images/layla-showcase/layla-search.png',
    width: 180,
    height: 211,
    alt: 'FACES mobile search screen with a Need help? Ask Layla AI prompt.',
  },
  {
    label: 'Product detail pages',
    title: 'Guidance can meet a specific product.',
    description:
      'A product page can hand the shopper directly to Layla when they need advice on that item before adding it to the bag.',
    src: '/images/layla-showcase/layla-pdp.png',
    width: 180,
    height: 373,
    alt: 'FACES product detail page with a Need advice on this item? Ask Layla AI prompt.',
  },
]
