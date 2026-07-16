import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ProjectHero from '@/components/media/ProjectHero'
import { createPageMetadata } from '@/lib/metadata'
import { getProjectBySlug, projects } from '@/lib/projects'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  return createPageMetadata({
    path: `/projects/${project.slug}`,
    title: project.slug === 'qeemat'
      ? 'Qeemat — UAE Price Tracker for Android'
      : `${project.title} — Adam's Portfolio`,
    description: project.description,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const otherProjects = projects.filter((p) => p.slug !== slug)

  return (
    <div className="content-layer">
      {/* Title section */}
      <Reveal type="slide-up">
        <section className="section page-hero case-hero">
        <div className="col wfull">
          <div className="worktitle">
            <span>A{String(projectIndex + 1).padStart(3, '0')}</span>
            <h1>{project.title}</h1>
          </div>
        </div>
        <div className="col wfull">
          <div className="meta">
            <div>
              <h2>Built with</h2>
              <p>
                {project.tech.slice(0, 3).join(', ')}
                {project.tech.length > 3 ? '...' : ''}
              </p>
            </div>
            {project.role && (
              <div>
                <h2>Role</h2>
                <p>{project.role}</p>
              </div>
            )}
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

      {project.image && (
        <Reveal type="fade">
          <section className="section">
            <div className="col wfull">
              <ProjectHero
                image={project.image}
                title={project.title}
                projectNumber={`A${String(projectIndex + 1).padStart(3, '0')}`}
                icon={project.icon ?? '◉'}
              />
            </div>
          </section>
        </Reveal>
      )}

      <Reveal type="fade">
        <section className="section case-content">
          <div className="col wfull case-copy">
            <p className="case-lead">{project.description}</p>
            {project.body && <p>{project.body}</p>}
          </div>
          <div className="col wfull case-details">
            <h2 className="section-label">Built with</h2>
            <div className="skill-list">
              {project.tech.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <div className="case-actions">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="button">
                GitHub ↗
              </a>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="button">
                  Live ↗
                </a>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {otherProjects.length > 0 && (
        <Reveal type="fade">
          <section className="section">
            <div className="col wfull">
              <h2 className="section-heading">Other projects</h2>
              <ul className="linelist">
                {otherProjects.map((otherProject) => (
                <li key={otherProject.slug}>
                  <Link href={`/projects/${otherProject.slug}`} className="line">
                    <span>
                      {String(projects.findIndex((candidate) => candidate.slug === otherProject.slug) + 1).padStart(3, '0')}{' '}
                      {otherProject.title.toUpperCase()}
                    </span>
                    <span>{otherProject.year ?? '—'}</span>
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
