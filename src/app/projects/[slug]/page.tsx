import { notFound } from 'next/navigation'
import TextCanvas from '@/components/TextCanvas'
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

  return (
    <main aria-label="Project detail canvas">
      <TextCanvas
        words={project.words}
        highlights={[
          { text: ' ← PROJECTS ', href: '/projects', zone: 'upper' },
          { text: ` ${project.title.toUpperCase()} `, zone: 'center', glitch: true },
          { text: ` ${project.description.toUpperCase()} `, zone: 'center' },
          { text: ` TECH: ${project.tech.join(' · ').toUpperCase()} `, zone: 'lower' },
          { text: ' GITHUB ', href: project.github, zone: 'lower' },
          ...(project.live ? [{ text: ' LIVE ', href: project.live, zone: 'lower' as const }] : []),
        ]}
      />
    </main>
  )
}
