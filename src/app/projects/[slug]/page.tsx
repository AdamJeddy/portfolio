import { notFound } from 'next/navigation'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ProjectHero from '@/components/media/ProjectHero'
import { getProjectBySlug, projects } from '@/lib/projects'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const projectIndex = projects.findIndex((p) => p.slug === slug)

  return (
    <div className="content-layer">
      {/* Title section */}
      <Reveal type="slide-up">
        <section className="section first">
        <div className="col w4">
          <div className="worktitle">
            <span>A{String(projectIndex + 1).padStart(3, '0')}</span>
            <h1>{project.title}</h1>
          </div>
        </div>
        <div className="col w4">
          <div className="meta">
            <div>
              <h2>Solutions</h2>
              <p>
                {project.tech.slice(0, 3).join(', ')}
                {project.tech.length > 3 ? '...' : ''}
              </p>
            </div>
            <div>
              <h2>Year</h2>
              <p>{project.year ?? '—'}</p>
            </div>
            <div>
              {project.live && (
                <p>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline' }}
                  >
                    {project.live.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Hero image */}
      <Reveal type="fade">
        <section className="section">
        <div className="col w4">
          <ProjectHero
            image={project.image}
            title={project.title}
            projectNumber={`A${String(projectIndex + 1).padStart(3, '0')}`}
            icon={
              project.slug === 'agentic-research-lab' ? '◇' :
              project.slug === 'signal-anomaly-dash' ? '◈' : '◉'
            }
          />
        </div>
      </section>
      </Reveal>

      {/* Description */}
      <Reveal type="fade">
        <section className="section">
        <div className="col w4">
          <p style={{
            fontFamily: 'var(--font-geist-sans), var(--font-sans)',
            fontSize: 'calc(var(--font-size) * 1.25)',
            lineHeight: 'calc(var(--line-px) * 1.25)',
            letterSpacing: '-0.01em',
          }}>
            {project.description}
          </p>
        </div>
      </section>
      </Reveal>

      {/* Body */}
      {project.body && (
        <Reveal type="fade">
          <section className="section">
          <div className="col w4">
            <p style={{ lineHeight: 'calc(var(--line-px) * 1.08)' }}>
              {project.body}
            </p>
          </div>
        </section>
        </Reveal>
      )}

      {/* Tech stack tags */}
      <Reveal type="fade">
        <section className="section">
        <div className="col w8">
          <h2 style={{
            fontFamily: 'var(--font-geist-mono), var(--font-mono)',
            textTransform: 'uppercase',
            marginBottom: 'var(--line-px)',
          }}>
            Tech
          </h2>
          <div style={{ display: 'flex', gap: 'var(--char)', flexWrap: 'wrap' }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                  background: 'rgba(var(--white-rgb), 0.08)',
                  padding: 'calc(var(--char) * 0.5) calc(var(--char) * 1)',
                  borderRadius: 'var(--border-radius)',
                  textTransform: 'uppercase',
                  fontSize: 'calc(var(--font-size) * 0.85)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Links */}
      <Reveal type="fade">
        <section className="section">
        <div className="col w8">
          <div style={{ display: 'flex', gap: 'var(--char)', marginTop: 'var(--line-px)' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="button">
              GitHub
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="button">
                Live
              </a>
            )}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Other projects line list */}
      <Reveal type="fade">
        <section className="section space">
        <div className="col w8">
          <h2 style={{
            fontFamily: 'var(--font-geist-mono), var(--font-mono)',
            textTransform: 'uppercase',
            marginBottom: 'var(--line-px)',
          }}>
            Other Projects
          </h2>
          <ul className="linelist">
            {projects
              .filter((p) => p.slug !== slug)
              .map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="line">
                    <span>
                      {String(projects.findIndex((x) => x.slug === p.slug) + 1).padStart(3, '0')}{' '}
                      {p.title.toUpperCase()}
                    </span>
                    <span>{p.year ?? '—'}</span>
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
