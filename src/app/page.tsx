import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'

const projectIcons: Record<string, string> = {
  'agentic-research-lab': '◇',
  'signal-anomaly-dash': '◈',
  'semantic-notebook': '◉',
}

export default function Home() {
  return (
    <>
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
