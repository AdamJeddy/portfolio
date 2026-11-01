import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import LaylaShowcase from '@/components/projects/LaylaShowcase'
import ProjectShowcase from '@/components/media/ProjectShowcase'
import { createPageMetadata } from '@/lib/metadata'
import { personReference, PERSON_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/schema'
import { homepageProjects } from '@/lib/homepage-projects'
import { getProjectStudy } from '@/lib/project-studies'
import { getProjectBySlug, projects } from '@/lib/projects'
import { PERSON_NAME, SITE_URL } from '@/lib/site'

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
    title: project.slug === 'qeemat' ? 'Qeemat: UAE Price Tracker for Android' : project.title,
    description: project.description,
  })
}

function projectJsonLd(slug: 'qeemat' | 'layla-ai', description: string) {
  const url = `${SITE_URL}/projects/${slug}`
  if (slug === 'qeemat') {
    return serializeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${url}#software`,
      name: 'Qeemat',
      description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Android',
      url,
      author: personReference,
      codeRepository: 'https://github.com/AdamJeddy/Qeemat',
      isPartOf: { '@id': WEBSITE_ID },
    })
  }
  return serializeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: 'Layla AI',
    description,
    url,
    creator: { '@type': 'Person', '@id': PERSON_ID, name: PERSON_NAME, url: `${SITE_URL}/about` },
    contributor: personReference,
    isPartOf: { '@id': WEBSITE_ID },
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  const feature = homepageProjects.find(item => item.slug === slug)
  const study = getProjectStudy(slug)
  const otherProjects = projects.filter(item => item.slug !== slug)
  const structuredData = projectJsonLd(project.slug as 'qeemat' | 'layla-ai', project.description)

  if (project.slug === 'layla-ai') {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        <LaylaShowcase project={project} />
      </>
    )
  }

  return (
    <article className={`studio-case studio-case--${slug}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
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
            <p className="studio-case-author">
              Built by <Link href="/about">{PERSON_NAME}</Link>.
            </p>
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
      {study ? <>
        <nav className="studio-case-nav studio-label" aria-label="Case study sections">
          <a href="#challenge">Challenge</a><a href="#contribution">My role</a><a href="#approach">Approach</a><a href="#outcome">Outcome</a>
        </nav>
        <section id="challenge" className="studio-story" aria-labelledby="challenge-title">
          <div><p className="studio-label">01 / Context</p><h2 id="challenge-title">The challenge.</h2></div>
          <p>{study.challenge}</p>
        </section>
        <section id="contribution" className="studio-story" aria-labelledby="contribution-title">
          <div><p className="studio-label">02 / Contribution</p><h2 id="contribution-title">My role.</h2></div>
          <div><p>{study.contribution}</p><ul className="studio-tags" aria-label={slug === 'qeemat' ? 'Technology' : 'Focus areas'}>
            {study.technologies.map(item => <li key={item}>{item}</li>)}
          </ul></div>
        </section>
        <section id="approach" className="studio-story" aria-labelledby="approach-title">
          <div><p className="studio-label">03 / Product choices</p><h2 id="approach-title">The approach.</h2></div>
          <ol className="studio-decisions">{study.decisions.map((decision, index) => <li key={decision.title}>
            <span className="studio-label">{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{decision.title}</h3><p>{decision.description}</p></div>
          </li>)}</ol>
        </section>
        <section id="outcome" className="studio-story" aria-labelledby="outcome-title">
          <div><p className="studio-label">04 / Outcome</p><h2 id="outcome-title">What it enables.</h2></div>
          <p>{study.outcome}</p>
        </section>
      </> : <section className="studio-story"><h2>Project overview.</h2><div>{project.details?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>}
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
