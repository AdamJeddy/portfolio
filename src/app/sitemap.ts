import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/writing`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
