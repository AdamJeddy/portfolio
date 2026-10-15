import Image from 'next/image'
import { homepageProjects } from '@/lib/homepage-projects'

export default function ProjectShowcase({ slug, priority = false }: { slug: string; priority?: boolean }) {
  const feature = homepageProjects.find(item => item.slug === slug)
  if (!feature) return null

  return (
    <figure className="studio-showcase">
      <picture>
        {'mobile' in feature && <source media="(max-width: 768px)" srcSet={feature.mobile.src} width={feature.mobile.width} height={feature.mobile.height} />}
        <Image src={feature.src} alt={feature.alt} width={feature.width} height={feature.height} unoptimized priority={priority} sizes="(max-width: 768px) 87vw, 54vw" />
      </picture>
      <figcaption>{feature.caption}</figcaption>
    </figure>
  )
}
