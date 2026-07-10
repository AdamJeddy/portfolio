import Link from 'next/link'
import { projects } from '@/lib/projects'

export default function Projects() {
  return (
    <div className="content-layer">
      <section className="section first">
        <div className="col w8">
          <p className="mega">Selected Work</p>
        </div>
      </section>

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
                      <span>{String(i + 1).padStart(3, '0')}</span>
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
    </div>
  )
}
