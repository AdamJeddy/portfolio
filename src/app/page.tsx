import TextCanvas from '@/components/TextCanvas'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
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

const projectIcons: Record<string, string> = {
  'agentic-research-lab': '◇',
  'signal-anomaly-dash': '◈',
  'semantic-notebook': '◉',
}

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
        <Reveal type="slide-up">
          <section className="section first">
            <div className="col w5">
              <p className="mega" style={{ marginBottom: 'calc(var(--line-px) * 1.5)' }}>
                Adam
              </p>
              <p style={{
                fontFamily: 'var(--font-geist-sans), var(--font-sans)',
                fontSize: 'calc(var(--font-size) * 1.4)',
                lineHeight: 'calc(var(--line-px) * 1.6)',
                letterSpacing: '-0.01em',
                opacity: 0.6,
                marginBottom: 'calc(var(--line-px) * 3)',
              }}>
                I curiously build things
              </p>
              <div style={{ display: 'flex', gap: 'var(--char)', marginTop: '10px' }}>
                <Link href="/projects" className="button large">
                  Work
                </Link>
                <Link href="/content" className="button large">
                  Writing
                </Link>
                <Link href="/the-person" className="button large">
                  About
                </Link>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Featured Projects */}
        <Reveal type="slide-up">
          <section className="section" style={{ marginTop: '30px' }}>
            <div className="col w8">
              <h2 style={{
                fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                textTransform: 'uppercase',
                marginBottom: 'calc(var(--line-px) * 2)',
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
                    data-reveal-child="slide-up"
                  >
                  <div className="project-placeholder" style={{ marginBottom: 'var(--line-px)' }}>
                    <div className="project-placeholder-inner">
                      <span className="project-placeholder-icon">
                        {projectIcons[project.slug] ?? '●'}
                      </span>
                      <span>A{String(i + 1).padStart(3, '0')}</span>
                    </div>
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
        </Reveal>

        {/* Latest Writing */}
        <Reveal type="slide-up">
        <section className="section" style={{ marginTop: '70px' }}>
          <div className="col w5">
            <h2 style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginBottom: 'calc(var(--line-px) * 2)',
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
            <div style={{ marginTop: 'calc(var(--line-px) * 1.5)' }}>
              <Link href="/content" className="button">
                All writing
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      </div>
    </>
  )
}
