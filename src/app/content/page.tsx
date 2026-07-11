import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { posts } from '@/lib/posts'

export default function Content() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
          <div className="col w5">
            <p className="mega">Writing</p>
            <p style={{
              fontFamily: 'var(--font-geist-sans), var(--font-sans)',
              fontSize: 'calc(var(--font-size) * 1.25)',
              lineHeight: 'calc(var(--line-px) * 1.4)',
              letterSpacing: '-0.01em',
              opacity: 0.6,
              marginTop: 'calc(var(--line-px) * 1.5)',
            }}>
              Thoughts on constraints, AI, and what makes tools useful.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
          <div className="col w5">
            <ul className="linelist">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/content/${post.slug}`} className="line">
                    <span>{post.title}</span>
                    <span>{post.excerpt}</span>
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
