import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProjectShowcase from '@/components/media/ProjectShowcase'
import { createPageMetadata } from '@/lib/metadata'
import { homepageProjects } from '@/lib/homepage-projects'
import { getProjectStudy } from '@/lib/project-studies'
import { getProjectBySlug, projects } from '@/lib/projects'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return createPageMetadata({
    path: `/projects/${project.slug}`,
    title: project.slug === 'qeemat' ? 'Qeemat — UAE Price Tracker for Android' : `${project.title} — Adam's Portfolio`,
    description: project.description,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  const feature = homepageProjects.find(item => item.slug === slug)
  const study = getProjectStudy(slug)
  const otherProjects = projects.filter(item => item.slug !== slug)

  return (
    <article className={`studio-case studio-case--${slug}`}>
      <section className="studio-case-hero" aria-labelledby="case-title">
        <Link className="studio-back studio-label" href="/projects">All projects</Link>
        <div className="studio-case-grid">
          <div>
            <div className="studio-case-kicker">
              <p className="studio-label">{feature?.label ?? 'Project'} / {project.year}</p>
              {feature && 'brand' in feature && <Image src={feature.brand.src} alt={feature.brand.alt} width={feature.brand.width} height={feature.brand.height} className="studio-case-brand" unoptimized />}
            </div>
            <h1 id="case-title">{project.title}</h1>
            <p className="studio-case-summary">{feature?.summary ?? project.description}</p>
            {study && <dl className="studio-facts">
              <div><dt>My role</dt><dd>{study.role}</dd></div>
              <div><dt>Focus</dt><dd>{study.focus}</dd></div>
            </dl>}
            <div className="studio-case-links">
              {project.links.map(link => <a className="studio-action" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}<Image src="/icons/arrow-up-right.svg" alt="" width={20} height={20} />
              </a>)}
            </div>
          </div>
          <ProjectShowcase slug={slug} priority />
        </div>
      </section>
      <section className="studio-story"><h2>Project overview.</h2><div>{project.details?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>
      <section className="studio-next" aria-label="Other projects">
        <p className="studio-label">Keep exploring</p>
        {otherProjects.map(other => <Link key={other.slug} href={`/projects/${other.slug}`}>
          <h2>{other.title}<Image src="/icons/arrow-up-right.svg" alt="" width={48} height={48} /></h2>
          <span className="studio-label">View project</span>
        </Link>)}
      </section>
    </article>
  )
}
