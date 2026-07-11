'use client'

import ImageWithAscii from './ImageWithAscii'

interface ProjectHeroProps {
  image?: string
  title: string
  projectNumber: string
  icon: string
}

/**
 * Client wrapper for the project detail hero image.
 * Shows ImageWithAscii when an image exists, gradient placeholder otherwise.
 */
export default function ProjectHero({ image, title, projectNumber, icon }: ProjectHeroProps) {
  if (image) {
    return (
      <div style={{ aspectRatio: '4/3', width: '100%' }}>
        <ImageWithAscii src={image} alt={title} />
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
