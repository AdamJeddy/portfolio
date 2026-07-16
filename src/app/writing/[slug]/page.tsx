import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { getPostBySlug, posts } from '@/lib/posts'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return createPageMetadata({
    path: `/writing/${post.slug}`,
    title: `${post.title} — Adam's Portfolio`,
    description: post.excerpt,
    type: 'article',
  })
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
        <article className="section page-hero writing-detail">
          <div className="col wfull">
            <Link href="/writing" className="back-link">← All writing</Link>
            <p className="eyebrow">Writing</p>
            <h1 className="mega page-title">{post.title}</h1>
            <p className="hero-copy writing-dek">{post.excerpt}</p>
          </div>
        </article>
      </Reveal>
    </div>
  )
}
