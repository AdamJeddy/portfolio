export interface PostItem {
  slug: string
  title: string
  excerpt: string
  words: string[]
}

export const posts: PostItem[] = [
  {
    slug: 'designing-with-constraints',
    title: 'Designing With Constraints',
    excerpt: 'Constraint-first product thinking creates stronger and more legible software.',
    words: [
      'constraint', 'scope', 'clarity', 'tradeoff', 'shape', 'focus', 'signal', 'noise', 'priority',
      'iteration', 'decision', 'feedback', 'surface', 'complexity', 'simplicity', 'quality',
    ],
  },
  {
    slug: 'what-makes-ai-products-useful',
    title: 'What Makes AI Products Useful',
    excerpt: 'Reliability, visible confidence, and graceful failure beat novelty every time.',
    words: [
      'utility', 'confidence', 'fallback', 'failure', 'prediction', 'explainability', 'latency',
      'evaluation', 'human', 'workflow', 'handoff', 'assist', 'trust', 'adoption', 'safety',
    ],
  },
  {
    slug: 'the-cost-of-silent-complexity',
    title: 'The Cost Of Silent Complexity',
    excerpt: 'Teams lose speed when complexity grows invisibly in interfaces and decisions.',
    words: [
      'complexity', 'entropy', 'maintenance', 'coupling', 'module', 'ownership', 'boundary',
      'dependency', 'drift', 'overhead', 'friction', 'debugging', 'review', 'rewrite',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}
