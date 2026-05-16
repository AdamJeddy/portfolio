import { notFound } from 'next/navigation'
import TextCanvas from '@/components/TextCanvas'
import { getPostBySlug, posts } from '@/lib/posts'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main aria-label="Post detail canvas">
      <TextCanvas
        words={post.words}
        highlights={[
          { text: ' ← WRITING ', href: '/content', zone: 'upper' },
          { text: ` ${post.title.toUpperCase()} `, zone: 'center', glitch: true },
          { text: ` ${post.excerpt.toUpperCase()} `, zone: 'lower' },
        ]}
      />
    </main>
  )
}
