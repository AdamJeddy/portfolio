import { notFound } from 'next/navigation'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
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
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
          <div className="col wfull">
            <p className="mega">{post.title}</p>
            <p style={{
              fontFamily: 'var(--font-geist-sans), var(--font-sans)',
              fontSize: 'calc(var(--font-size) * 1.25)',
              lineHeight: 'calc(var(--line-px) * 1.4)',
              letterSpacing: '-0.01em',
              opacity: 0.6,
              marginTop: 'calc(var(--line-px) * 2)',
              marginBottom: 'calc(var(--line-px) * 3)',
            }}>
              {post.excerpt}
            </p>
            <Link href="/writing" className="button">
              ← All writing
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
