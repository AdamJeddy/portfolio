import type { Metadata } from 'next'
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
  X_HANDLE,
} from './site'

interface PageMetadataOptions {
  path: string
  title: string
  description: string
  type?: 'website' | 'article'
}

export function createPageMetadata({
  path,
  title,
  description,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL)
  const socialImage = new URL(DEFAULT_SOCIAL_IMAGE, SITE_URL)
  const socialImageAlt = 'Abstract dark text-canvas texture with a warm amber accent.'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: X_HANDLE,
      images: [
        {
          url: socialImage,
          alt: socialImageAlt,
        },
      ],
    },
  }
}
