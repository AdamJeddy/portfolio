import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { CONTENT_UPDATED, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

const siteUpdated = new Date(`${CONTENT_UPDATED}T00:00:00+04:00`)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: siteUpdated,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: siteUpdated,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/writing`,
      lastModified: siteUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: new Date(`${post.updatedAt}T00:00:00+04:00`),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
