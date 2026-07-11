export interface PostItem {
  slug: string
  title: string
  excerpt: string
  image?: string
  words: string[]
}

export const posts: PostItem[] = [
  {
    slug: 'ugly-truth-luxury-brands-ai-content',
    title: 'Ugly Truth Luxury Brands Won\'t Say About AI Content',
    excerpt: 'Luxury brands don\'t care about AI vs. traditional tools — they care about standards, taste, and brand codes.',
    words: [
      'luxury', 'brand', 'standard', 'taste', 'output', 'control', 'feeling', 'finish',
      'process', 'tool', 'creative', 'production', 'guardian', 'judgment', 'speed',
      'quality', 'emotional', 'code', 'belief', 'memory', 'traditional', 'generated',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}
