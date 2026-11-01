import Link from 'next/link'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'
import '../studio-pages.css'

export const metadata = createPageMetadata({
  path: '/writing',
  title: 'Commentary by Adam Ahsan — AI, Product & Luxury',
  absoluteTitle: true,
  description:
    'Essays and commentary by Adam Ahsan on AI, products, luxury, and the choices that shape them.',
})

export default function Content() {
  return (
    <div className="studio-page studio-writing-page">
      <section className="studio-page-hero" aria-labelledby="writing-title">
        <div>
          <p className="studio-page-label">Commentary / Field notes</p>
          <h1 id="writing-title">Yaps, and thoughts.</h1>
        </div>
        <p className="studio-page-intro">
          Essays and commentary by Adam Ahsan on AI, products, and the choices that shape them.
        </p>
      </section>

      <section className="studio-writing-list" aria-label="Commentary">
        <ol>
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`} className="studio-writing-row">
                <span className="studio-page-label studio-writing-row-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
                <span className="studio-page-meta studio-writing-row-meta">
                  <span>{post.publishedAt.slice(0, 4)} / {post.readingTime}</span>
                </span>
                <span className="studio-writing-row-arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
