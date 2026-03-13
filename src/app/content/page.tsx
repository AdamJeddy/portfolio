import TextCanvas from '@/components/TextCanvas'
import { posts } from '@/lib/posts'

const writingWords = [
  'argument', 'premise', 'chapter', 'draft', 'thesis', 'critique', 'annotation', 'footnote', 'excerpt',
  'citation', 'narrative', 'outline', 'revision', 'voice', 'prose', 'idea', 'concept', 'assumption',
  'evidence', 'reasoning', 'counterpoint', 'reflection', 'insight', 'framing', 'paragraph', 'sentence',
]

export default function Content() {
  return (
    <main aria-label="Writing canvas">
      <TextCanvas
        words={writingWords}
        highlights={[
          { text: ' ← BACK ', href: '/', zone: 'upper' },
          ...posts.map((post) => ({
            text: ` ${post.title.toUpperCase()} `,
            href: `/content/${post.slug}`,
            zone: 'center' as const,
          })),
        ]}
      />
    </main>
  )
}
