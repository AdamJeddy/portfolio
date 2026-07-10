import TextCanvas from '@/components/TextCanvas'
import Link from 'next/link'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'

const homeWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus',
  'error', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque',
  'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae',
]

export default function Home() {
  return (
    <>
      {/* Canvas Layer — the TextCanvas as a background */}
      <div className="canvas-layer">
        <TextCanvas
          words={homeWords}
          highlights={[
            { text: ' by Adam ', zone: 'center', glitch: true, centerAligned: true },
          ]}
        />
      </div>

      {/* Content Layer — scrollable on top */}
      <div className="content-layer">
        <section className="section first">
          <div className="col w5">
            <p className="mega">
              Adam — Software Engineer. I build things with curiosity.
            </p>
            <div style={{ display: 'flex', gap: 'var(--char)', marginTop: 'var(--line-px)' }}>
              <Link href="/projects" className="button">
                Work
              </Link>
              <Link href="/content" className="button">
                Writing
              </Link>
              <Link href="/the-person" className="button">
                About
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="section space">
          <div className="col w8">
            <h2 style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginBottom: 'var(--line-px)',
            }}>
              Selected Work
            </h2>
            <div style={{ display: 'flex', gap: 'var(--char2)', flexWrap: 'wrap' }}>
              {projects.slice(0, 3).map((project, i) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  style={{
                    flex: '0 0 calc(50% - var(--char))',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'rgba(var(--white-rgb), 0.05)',
                    marginBottom: 'var(--line-px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                    fontSize: 'calc(var(--font-size) * 2)',
                    opacity: 0.3,
                  }}>
                    A{String(i + 1).padStart(3, '0')}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                    textTransform: 'uppercase',
                    fontSize: 'var(--font-size)',
                  }}>
                    {project.title}
                  </p>
                  <p style={{ opacity: 0.5, fontSize: 'calc(var(--font-size) * 0.9)' }}>
                    {project.tech.slice(0, 3).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Writing */}
        <section className="section space">
          <div className="col w5">
            <h2 style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginBottom: 'var(--line-px)',
            }}>
              Latest Writing
            </h2>
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
      </div>
    </>
  )
}
