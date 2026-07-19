import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'

export const metadata = createPageMetadata({
  path: '/writing',
  title: "Commentary — Adam's Portfolio",
  description: 'Commentary, thoughts, and observations by Adam.',
})

export default function Content() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section page-hero">
          <div className="col wfull">
            <p className="eyebrow">Commentary</p>
            <h1 className="mega page-title">Yaps, and <strong>Thoughts.</strong></h1>
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
