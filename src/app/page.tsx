import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'

function Spacer({ height = 40 }: { height?: number }) {
  return <div aria-hidden="true" style={{ height, width: '100%', minHeight: height }} />
}

export default function Home() {
  return (
    <div className="content-layer">
      <Spacer height={40} />

      {/* ── Hero ────────────────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section first">
          <div className="col wfull">
            <p className="mega">
              Adam
            </p>
            <Spacer height={8} />
            <p style={{
              fontFamily: 'var(--font-geist-sans), var(--font-sans)',
              fontSize: 'calc(var(--font-size) * 1.4)',
              lineHeight: 'calc(var(--line-px) * 1.6)',
              letterSpacing: '-0.01em',
              opacity: 0.6,
            }}>
              I curiously build things
            </p>
          </div>
        </section>
      </Reveal>

      <Spacer height={40} />

      {/* ── Featured Work ───────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section">
          <div className="col wfull">
            <h2 style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
            }}>
              Selected Work
            </h2>

            <Spacer height={24} />

            <ul className="linelist">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="line">
                    <div>
                      <span style={{ display: 'block' }}>{project.title}</span>
                      <span style={{
                        display: 'block',
                        opacity: 0.45,
                        fontSize: 'calc(var(--font-size) * 0.92)',
                        textTransform: 'none',
                        fontFamily: 'var(--font-geist-sans), var(--font-sans)',
                        marginTop: '6px',
                      }}>
                        {project.description}
                      </span>
                    </div>
                    <span>{project.year ?? '—'}</span>
                  </Link>
                </li>
              ))}
            </ul>

        </div>
      </section>
      </Reveal>

      <div style={{ textAlign: 'right', width: '100%' }}>
        <Link href="/projects" className="button">
          All projects →
        </Link>
      </div>

      <Spacer height={40} />

      {/* ── Latest Writing ──────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section">
          <div className="col wfull">
            <h2 style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
            }}>
              Latest Writing
            </h2>

            <Spacer height={24} />

            <ul className="linelist">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className="line">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--char2)' }}>
                      {post.image && (
                        <img
                          src={post.image}
                          alt=""
                          style={{
                            width: '48px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '2px',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      <div style={{ textAlign: 'right', width: '100%' }}>
        <Link href="/writing" className="button">
          All writing →
        </Link>
      </div>

      <Spacer height={24} />
    </div>
  )
}
