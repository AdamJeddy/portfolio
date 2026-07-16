import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { projects } from '@/lib/projects'

export const metadata = createPageMetadata({
  path: '/projects',
  title: "Projects — Adam's Portfolio",
  description: 'Explore practical products by Adam, including local-first tools, AI work, and experiments.',
})

export default function Projects() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section page-hero">
          <div className="col wfull">
            <p className="eyebrow">Work</p>
            <h1 className="mega page-title">Selected work</h1>
            <p className="hero-copy">Practical products built around clarity, reliability, and real-world constraints.</p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
        <div className="col wfull">
          <div className="project-grid">
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`project-card ${project.image ? '' : 'project-card--text'}`.trim()}
              >
                {project.image && (
                  <div className="project-image">
                    {/* Static export uses raw images until a Cloudflare-compatible image loader is introduced. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="project-info">
                  <p className="project-description">{project.description}</p>
                  <p className="project-meta">
                    {project.role} · {project.tech.slice(0, 3).join(' · ')}
                  </p>
                  <span className="project-number">
                    A{String(i + 1).padStart(3, '0')}
                  </span>
                  <span className="project-title">{project.title}</span>
                  <span className="project-year">
                    {project.year ?? '—'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </Reveal>
    </div>
  )
}
