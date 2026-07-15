import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { projects } from '@/lib/projects'

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
