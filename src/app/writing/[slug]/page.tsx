import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { getPostBySlug, posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

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
    <div className="content-layer">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <Reveal type="slide-up">
        <article className="section page-hero writing-detail">
          <div className="col wfull">
            <Link href="/writing" className="back-link">
              <span aria-hidden="true">&larr;</span>{' '}All writing
            </Link>
            <p className="eyebrow">Writing</p>
            <h1 className="mega page-title">{post.title}</h1>
            <p className="hero-copy writing-dek">{post.excerpt}</p>
            <p className="writing-meta">
              <span>By Adam</span>
              <span aria-hidden="true">&middot;</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingTime}</span>
            </p>
          </div>
        </article>
      </Reveal>

      <Reveal type="fade">
        <article className="section writing-article">
          <div className="col wfull writing-body">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <p className="writing-source">
              First published on{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                Medium
              </a>.
            </p>
          </div>
        </article>
      </Reveal>

      {relatedPosts.length > 0 && (
        <Reveal type="fade">
          <section className="section writing-related">
            <div className="col wfull">
              <h2 className="section-heading">Keep reading</h2>
              <ul className="linelist">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.slug}>
                    <Link href={`/writing/${relatedPost.slug}`} className="line writing-row">
                      <span className="writing-row-title">{relatedPost.title}</span>
                      <span className="writing-row-excerpt">{relatedPost.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}
    </div>
  )
}
