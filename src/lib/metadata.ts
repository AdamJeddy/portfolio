import type { Metadata } from 'next'
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
} from './site'

interface PageMetadataOptions {
  path: string
  title: string
  description: string
  type?: 'website' | 'article'
  /** Use the title verbatim instead of running it through the root title template. */
  absoluteTitle?: boolean
  image?: string
  imageAlt?: string
  publishedTime?: string
  modifiedTime?: string
}

export function createPageMetadata({
  path,
  title,
  description,
  type = 'website',
  absoluteTitle = false,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL)
  const socialImage = new URL(image, SITE_URL)
  // Next only templates <title>; social cards read their own title fields, so
  // resolve the same full title here to keep the name-bearing suffix everywhere.
  const resolvedTitle = absoluteTitle ? title : `${title} — ${PERSON_NAME}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors: [{ name: PERSON_NAME, url: `${SITE_URL}/about` }],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [
        {
          url: socialImage,
          alt: imageAlt,
        },
      ],
    },
  }
}
