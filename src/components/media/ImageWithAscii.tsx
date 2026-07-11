'use client'

import { useEffect, useRef, useState } from 'react'
import { imageToAscii } from '@/lib/ascii'

interface ImageWithAsciiProps {
  src: string
  alt: string
  cols?: number
  rows?: number
  className?: string
}

/**
 * Renders an image with a clean ASCII text overlay intro.
 * ASCII appears on top, then fades out to reveal the image.
 */
export default function ImageWithAscii({
  src,
  alt,
  cols: propCols = 100,
  rows: propRows,
  className,
}: ImageWithAsciiProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [ascii, setAscii] = useState('')
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const render = () => {
      const aspectRatio = img.naturalHeight / img.naturalWidth || 0.75
      const rows = propRows ?? Math.round(propCols * aspectRatio / 2)
      const result = imageToAscii(img, propCols, rows)
      setAscii(result)

      // Fade out after 2s
      setTimeout(() => setFading(true), 2000)
    }

    if (img.complete) {
      render()
    } else {
      img.addEventListener('load', render, { once: true })
    }
  }, [src, propCols, propRows])

  return (
    <div className={`image-intro ${className ?? ''}`.trim()}>
      {ascii && (
        <div
          aria-hidden="true"
          className={`image-ascii ${fading ? 'fade-out' : ''}`}
        >
          {ascii}
        </div>
      )}
      <img ref={imgRef} src={src} alt={alt} crossOrigin="anonymous" />
    </div>
  )
}
