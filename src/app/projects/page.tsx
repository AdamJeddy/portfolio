import Image from 'next/image'
import Link from 'next/link'
import ProjectShowcase from '@/components/media/ProjectShowcase'
import { createPageMetadata } from '@/lib/metadata'
import { homepageProjects } from '@/lib/homepage-projects'
import { getProjectBySlug } from '@/lib/projects'

export const metadata = createPageMetadata({
  path: '/projects',
  title: 'Projects by Adam Ahsan — Layla AI & Qeemat',
  absoluteTitle: true,
  description:
    'Selected work by Adam Ahsan: Layla AI inside the FACES app, Qeemat, and other projects and experiments.',
})

export default function Projects() {
  return (
    <>
      <section className="studio-index-hero" aria-labelledby="projects-title">
        <p className="studio-label">Selected work by Adam Ahsan</p>
        <h1 id="projects-title">Things I&apos;m building.</h1>
        <p>Projects, experiments, and ideas I wanted to make real.</p>
      </section>
      {homepageProjects.map((feature, index) => {
        const project = getProjectBySlug(feature.slug)
        if (!project) return null
        return (
          <Link className={`studio-project-row studio-project-row--${project.slug}`} href={`/projects/${project.slug}`} key={project.slug}>
            <div>
              <p className="studio-label">{String(index + 1).padStart(2, '0')} / {feature.label}</p>
              <h2>{project.title}</h2>
              <p>{feature.summary}</p>
              <span className="studio-action">Explore project <Image src="/icons/arrow-up-right.svg" alt="" width={20} height={20} /></span>
            </div>
            <ProjectShowcase slug={project.slug} priority={index === 0} />
          </Link>
        )
      })}
    </>
  )
}
