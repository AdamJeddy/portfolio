import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'

export const metadata = createPageMetadata({
  path: '/writing',
  title: "Writing on AI, Luxury & Useful Things — Adam's Portfolio",
  description: 'Notes by Adam on AI, luxury, and what makes tools useful.',
})

export default function Content() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section page-hero">
          <div className="col wfull">
            <p className="eyebrow">Writing</p>
            <h1 className="mega page-title">Notes on useful things</h1>
            <p className="hero-copy">
              Thoughts on AI, luxury, and what makes tools useful.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
          <div className="col wfull">
            <ul className="linelist">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className="line writing-row">
                    <span className="writing-row-title">{post.title}</span>
                    <span className="writing-row-excerpt">{post.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
