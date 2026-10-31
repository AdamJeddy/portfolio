import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createPageMetadata } from '@/lib/metadata'
import { getPostBySlug, posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'
import '../../studio-pages.css'

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
    title: `${post.title} - Adam's Portfolio`,
    description: post.excerpt,
    type: 'article',
  })
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = posts.filter((item) => item.slug !== post.slug)
  const postNumber = String(posts.findIndex((item) => item.slug === post.slug) + 1).padStart(2, '0')
  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: 'Adam',
    },
    mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: "Adam's Portfolio",
      url: SITE_URL,
    },
  })

  return (
    <div className="studio-page studio-article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <article>
        <header className="studio-article-hero">
          <Link href="/writing" className="studio-page-action studio-article-back">
            <span aria-hidden="true">←</span>{' '}All commentary
          </Link>
          <div className="studio-article-ledger studio-page-label">
            <span>Commentary / {postNumber}</span>
            <span><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> / {post.readingTime}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="studio-article-dek">{post.excerpt}</p>
        </header>

        <div className="studio-article-content">
          <aside className="studio-article-rail" aria-label="Article details">
            <span>By Adam</span>
            <span>{post.publishedAt.slice(0, 4)}</span>
            <span>{post.readingTime}</span>
          </aside>
          <div className="studio-article-body">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <p className="studio-article-source">
              First published on{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                Medium
              </a>.
            </p>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="studio-related" aria-labelledby="related-title">
          <div className="studio-related-heading">
            <p className="studio-page-label">More commentary</p>
            <h2 id="related-title">Keep reading.</h2>
          </div>
          <ul className="studio-related-list">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug}>
                <Link href={`/writing/${relatedPost.slug}`}>
                  <h3>{relatedPost.title}</h3>
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
