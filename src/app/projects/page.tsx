import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { projects } from '@/lib/projects'

export default function Projects() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
          <div className="col w8">
            <p className="mega">Selected Work</p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
        <div className="col w8">
          <div className="project-grid">
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="project-card"
              >
                <div className="project-image">
                  {project.image ? (
                    <img src={project.image} alt={project.title} />
                  ) : (
                    <div className="project-placeholder">
                      <div className="project-placeholder-inner">
                        <span className="project-placeholder-icon">
                          {project.icon ?? '●'}
                        </span>
                        <span>A{String(i + 1).padStart(3, '0')}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="project-info">
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
