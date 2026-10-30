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
    title: 'Learn the person.',
    description:
      'Beauty Passport brings together a shopper’s scent profile, skin score, and the products already on their shelf.',
  },
  {
    number: '02',
    title: 'Curate the next move.',
    description:
      'The conversation and profile shape a feed of products, routines, and ideas that feels relevant to that person.',
  },
  {
    number: '03',
    title: 'Advise at the decision.',
    description:
      'Layla is available where a question appears: in search, on a product page, or in a dedicated chat.',
  },
  {
    number: '04',
    title: 'Make buying effortless.',
    description:
      'Shoppable product cards, offers, samples, and fast checkout keep useful advice connected to a clear action.',
  },
] as const

export const laylaProductAreas = ['Skincare', 'Fragrance', 'Makeup', 'Haircare'] as const

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
  {
    label: 'Beauty Shelf',
    title: 'Let the routine in on the conversation.',
    description:
      'Customers can add what they already own, including by identifying a product from an image, so advice has the right context.',
    src: '/images/layla-showcase/product-identification.jpg',
    width: 1440,
    height: 2991,
    alt: 'Layla identifying a photographed fragrance product to add to a customer’s beauty shelf.',
  },
]

export const laylaCommerceFeatures: LaylaScreen[] = [
  {
    label: 'Personalised discovery',
    title: 'A feed shaped by the customer, not a campaign calendar.',
    description:
      'Dynamic product cards respond to the customer’s conversation and Beauty Passport, helping the next recommendation feel more timely.',
    src: '/images/layla-showcase/personalised-feed.jpg',
    width: 1440,
    height: 2992,
    alt: 'Layla showing a personalised FACES product feed with beauty preference filters and sunscreen cards.',
  },
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
