interface ProjectStudy {
  slug: string
  role: string
  focus: string
  challenge: string
  contribution: string
  decisions: { title: string; description: string }[]
  outcome: string
  technologies: string[]
}

// Case-study copy grounded in the existing project descriptions; no inferred metrics.
export const projectStudies: ProjectStudy[] = [
  {
    slug: 'layla-ai',
    role: 'Technical integration lead',
    focus: 'AI-assisted beauty commerce',
    challenge: 'Bring personal beauty guidance into a shopping experience, so customers can ask a question, discover relevant products, and act on a recommendation without leaving the conversation.',
    contribution: 'I led Layla’s technical integration into the FACES app, connecting the assistant to a customer-facing beauty shopping experience.',
    decisions: [
      {
        title: 'Meet customers inside FACES',
        description: 'The assistant lives inside the existing FACES app, connecting beauty advice to the shopping experience customers already use.',
      },
      {
        title: 'Connect advice to action',
        description: 'Product recommendations and adding items to the bag stay in the conversation, keeping discovery and shopping together.',
      },
      {
        title: 'Support different beauty needs',
        description: 'Guidance spans skincare, fragrance, makeup, and haircare, rather than treating every question as a product search.',
      },
    ],
    outcome: 'Customers can get beauty advice, discover recommended products, and add them to their bag through Layla in the FACES app.',
    technologies: ['AI assistant', 'Mobile integration', 'Conversational commerce'],
  },
  {
    slug: 'qeemat',
    role: 'Creator & owner',
    focus: 'Local-first price tracking',
    challenge: 'Checking the same product across UAE shopping sites takes repeated visits. Qeemat brings those checks into a personal watchlist with price history and alerts.',
    contribution: 'I built and own Qeemat end to end: the product, Android app, retailer product parsing, on-device price storage, background checks, and local price-drop notifications.',
    decisions: [
      {
        title: 'Keep the data on the device',
        description: 'Products and price history are stored locally with AsyncStorage. The app does not require an account, backend, or cloud sync.',
      },
      {
        title: 'Make checking a background task',
        description: 'Android WorkManager schedules price checks, while local notifications bring price drops back to the shopper.',
      },
      {
        title: 'Start with a product link',
        description: 'Shoppers add a URL from a supported retailer. Store-specific parsing turns that page into a product Qeemat can track.',
      },
    ],
    outcome: 'A focused Android-first tool for tracking supported UAE product links, retaining price history on-device, and receiving local price-drop alerts. The GitHub repository documents the implementation; the portfolio artwork is a product concept.',
    technologies: ['React Native', 'TypeScript', 'AsyncStorage', 'Android WorkManager'],
  },
]

export function getProjectStudy(slug: string) {
  return projectStudies.find(study => study.slug === slug)
}
