interface ProjectHeroProps {
  image?: string
  title: string
  projectNumber: string
  icon: string
}

/**
 * Shows a project image when one exists, or a graphic placeholder otherwise.
 */
export default function ProjectHero({ image, title, projectNumber, icon }: ProjectHeroProps) {
  if (image) {
    return (
      <div className="project-hero-image">
        {/* Static export uses raw images until a Cloudflare-compatible image loader is introduced. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} />
      </div>
    )
  }

  return (
    <div className="project-placeholder" style={{ aspectRatio: '4/3', width: '100%' }}>
      <div className="project-placeholder-inner">
        <span className="project-placeholder-icon">{icon}</span>
        <span>{projectNumber}</span>
      </div>
    </div>
  )
}
