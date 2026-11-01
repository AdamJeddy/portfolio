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
    role: 'Backend & AI lead',
    focus: 'AI assistant core & features',
    challenge: 'Bring personal beauty guidance into a shopping experience, so customers can ask a question, discover relevant products, and act on a recommendation without leaving the conversation.',
    contribution: 'I built Layla’s core: the backend, the AI features around it, and the systems that turn a shopper’s context into useful product guidance. A big part of the work was staying on the frontier — evaluating the best available AI technology and deciding what genuinely belonged in the product. The FACES app itself — its screens and shop surfaces — was built by the app team; my work powered what happened inside it.',
    decisions: [
      {
        title: 'Put the intelligence in the backend',
        description: 'Layla’s AI capabilities run behind the app, so the assistant’s reasoning, shopper context, and recommendations can evolve independently of the interface.',
      },
      {
        title: 'Ground advice in shopper context',
        description: 'Beauty Passport context — skin, scent, routine — feeds the AI features, so guidance is specific to the customer instead of a generic product search.',
      },
      {
        title: 'Work at the frontier',
        description: 'Much of the project was spent evaluating new AI capabilities and deciding where they genuinely improved the conversation, rather than adding them because they were new.',
      },
    ],
    outcome: 'Layla’s AI features — conversation, personalisation, and product guidance — run on the backend I built, while the FACES app team owned the app experience.',
    technologies: ['Backend services', 'AI features', 'Frontier AI evaluation', 'Context & prompt design', 'Conversational AI'],
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
