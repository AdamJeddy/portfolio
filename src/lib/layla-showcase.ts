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
  src: '/images/layla-showcase/layla-editorial-hero-v2.png',
  width: 1536,
  height: 1024,
  alt: 'Art-directed beauty-shopping scene with the Layla Beauty Passport integrated into a phone screen, surrounded by fragrance and skincare products.',
}

export const laylaPassportOverview: LaylaScreen = {
  label: 'Beauty Passport',
  title: 'Skin, scent, and routine context in one place.',
  description:
    'Customers build a profile from the beauty information they choose to share, giving each next recommendation a more useful starting point.',
  src: '/images/layla-showcase/beauty-passport.jpg',
  width: 1440,
  height: 3013,
  alt: 'Layla Beauty Passport in the FACES app showing scent profile, skin score, and a beauty shelf.',
}

export const laylaPassportFeatures: LaylaScreen[] = [
  {
    label: 'Scent Profile',
    title: 'A quiz creates a fragrance profile.',
    description:
      'A short quiz gives the assistant a shared vocabulary for notes, families, and the styles a customer is likely to enjoy.',
    src: '/images/layla-showcase/scent-profile.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla scent profile screen listing a shopper’s fragrance preferences and top notes.',
  },
  {
    label: 'Skin Score',
    title: 'A selfie-led check creates a trackable skin score.',
    description:
      'A selfie-led assessment and follow-up inputs create a score that can be tracked over time, with a clearer basis for product guidance.',
    src: '/images/layla-showcase/skin-score.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla skin score screen showing combination skin, a score, and detailed factors.',
  },
  {
    label: 'Beauty Shelf',
    title: 'What a customer already owns is part of the guidance.',
    description:
      'Customers can add products they use—or identify an item from a photo—so Layla can account for the routine that is already in place.',
    src: '/images/layla-showcase/product-identification.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla identifying a fragrance bottle from a customer-provided photo.',
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
    title: 'Search can become a conversation.',
    description:
      'The search experience provides a direct way to ask Layla for help when browsing alone is not enough.',
    src: '/images/layla-showcase/layla-search-entry-v2.png',
    width: 1448,
    height: 1086,
    alt: 'Illustrative FACES search surface with Dior results and a prominent Ask Layla AI entry point.',
  },
  {
    label: 'Product detail pages',
    title: 'A product question does not need a separate search.',
    description:
      'A product page can hand the shopper directly to Layla when they need advice on that item before adding it to the bag.',
    src: '/images/layla-showcase/layla-pdp-entry-v2.png',
    width: 1448,
    height: 1086,
    alt: 'Illustrative FACES product-detail surface with fragrance choices and a prominent Ask Layla AI entry point.',
  },
  {
    label: 'Dedicated chat',
    title: 'One place for deeper advice and follow-up.',
    description:
      'Layla carries comparison, routine building, order support, and the next beauty question in a persistent conversation.',
    src: '/images/layla-showcase/layla-chat-entry.jpg',
    width: 1440,
    height: 901,
    alt: 'Layla AI chat composer in the FACES app.',
  },
]

export const laylaOrderSupport: LaylaScreen = {
  label: 'Order support',
  title: 'Order questions stay in the conversation.',
  description:
    'After checkout, Layla can surface order status and give a customer a direct route to delivery help without making them start over.',
  src: '/images/layla-showcase/layla-order-support-v1.png',
  width: 878,
  height: 1794,
  alt: 'Illustrative Layla order-support screen with an order-status timeline and support action.',
}

export const laylaReportedImpact = [
  {
    value: '2.5×',
    description: 'higher conversion than non-AI sessions',
  },
  {
    value: '+7.4 min',
    description: 'longer browsing sessions on average',
  },
  {
    value: '+27%',
    description: 'more products explored',
  },
] as const
