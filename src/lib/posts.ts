export interface PostSection {
  heading: string
  paragraphs: string[]
}

export interface PostItem {
  slug: string
  title: string
  excerpt: string
  image?: string
  publishedAt: string
  updatedAt: string
  readingTime: string
  sourceUrl: string
  sections: PostSection[]
  words: string[]
}

export const posts: PostItem[] = [
  {
    slug: 'ugly-truth-luxury-brands-ai-content',
    title: "Ugly Truth Luxury Brands Won't Say About AI Content",
    excerpt: 'Luxury brands care less about the AI-versus-traditional-tools debate than they do about standards, taste, and brand codes.',
    publishedAt: '2026-01-17',
    updatedAt: '2026-01-17',
    readingTime: '3 min read',
    sourceUrl: 'https://medium.com/@uhdam/ugly-truth-luxury-brands-wont-say-about-ai-content-01f5cbb1b286',
    sections: [
      {
        heading: 'The debate is louder outside the brand room',
        paragraphs: [
          'AI content invites an endless argument about authenticity, effort, and whether a prompt can carry the same weight as traditional craft. Those questions matter to the people making the work. Inside a brand, the decision is usually more direct: does the result meet the standard?',
          'A luxury brief is built around mood, precision, and the codes that make a brand recognisable. The brief is not really about proving loyalty to a particular tool. It is about protecting the feeling the customer is meant to have.',
        ],
      },
      {
        heading: 'Luxury optimises for finish, not process',
        paragraphs: [
          'Luxury is not sold through a production timeline. It is sold through control: the confidence that every visual, word, and detail belongs to the same world. When an AI-assisted image achieves that level of control, the toolchain becomes secondary to the finish.',
          'That does not mean craft disappears. It means the invisible parts of craft become more important. A background can be generated quickly, but knowing whether it weakens the mood, misses the brand codes, or feels generic is still a human judgment.',
        ],
      },
      {
        heading: 'More output raises the bar for taste',
        paragraphs: [
          'AI makes variations cheap. That is useful only when someone can recognise the one worth keeping. More options do not create a stronger campaign by themselves; they create more opportunities to choose something forgettable.',
          'The people responsible for a brand still need to set the standard, reject weak work, and hold the final output together. AI can make a poor decision faster just as easily as it can accelerate a good one.',
        ],
      },
      {
        heading: 'Tools change. The responsibility does not.',
        paragraphs: [
          'The most useful way to think about AI in luxury is as another production tool. It can expand what a small team can explore, but it cannot supply taste, accountability, or an understanding of why an image belongs to a particular brand.',
          'The lasting question is not whether a piece was made with AI. It is whether the people responsible for it protected the output, the feeling, and the codes that make the brand worth believing in.',
        ],
      },
    ],
    words: [
      'luxury', 'brand', 'standard', 'taste', 'output', 'control', 'feeling', 'finish',
      'process', 'tool', 'creative', 'production', 'guardian', 'judgment', 'speed',
      'quality', 'emotional', 'code', 'belief', 'memory', 'traditional', 'generated',
    ],
  },
  {
    slug: 'quiet-death-saas-pricing-power',
    title: 'The Quiet Death of SaaS Pricing Power',
    excerpt: 'AI is not only changing what SaaS products can do. It is changing the leverage customers bring to every renewal conversation.',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '5 min read',
    sourceUrl: 'https://medium.com/@uhdam/the-quiet-death-of-saas-pricing-power-88c2ee33f7a0',
    sections: [
      {
        heading: 'The new question at renewal',
        paragraphs: [
          'The old SaaS renewal conversation was mostly about value, switching costs, and the inconvenience of changing a workflow that already works. AI has introduced a sharper question: how difficult would it be to build the essential part of this product ourselves?',
          'The answer does not need to be “easy” for pricing power to change. A credible internal alternative gives buyers leverage. It turns a familiar annual increase into a negotiation about whether the product is truly worth the premium.',
        ],
      },
      {
        heading: 'Feature velocity is not a moat',
        paragraphs: [
          'AI lowers the cost of turning a reasonable product idea into a working feature set. Incumbents benefit from that speed, but so do challengers and internal teams. Shipping faster is useful; it is not the same thing as becoming harder to replace.',
          'The vulnerable products are not necessarily bad products. Many have real customers and useful workflows. The problem is that some of their value was always a mix of product quality and the friction of doing anything else. As the friction falls, the second part weakens.',
        ],
      },
      {
        heading: 'Seat-based revenue has a hidden dependency',
        paragraphs: [
          'A large part of SaaS revenue is tied to the number of people at a customer who need access. When customers automate work or reduce headcount, fewer people can mean fewer seats. That is not a sales objection a better account manager can solve; it is a change in the customer’s operating model.',
          'Founders should look beyond historical churn curves. If the economics of the customer change, the assumptions underneath expansion and renewal can change with them.',
        ],
      },
      {
        heading: 'Treat it as a repricing problem',
        paragraphs: [
          'The useful response is not panic or a generic AI feature checklist. It is an honest review of where the product creates durable value: proprietary data, trusted workflow ownership, domain expertise, reliability, or outcomes that are difficult to reproduce.',
          'A business that relies on inertia should assume inertia has an expiry date. A business that solves a painful, specific problem better than an internal team can should make that advantage obvious in the product, the pricing, and every customer conversation.',
        ],
      },
    ],
    words: [
      'saas', 'pricing', 'renewal', 'margin', 'moat', 'automation', 'ai', 'product',
      'software', 'founder', 'customer', 'seat', 'churn', 'retention', 'strategy',
      'competition', 'workflow', 'value', 'internal', 'build', 'leverage',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}
