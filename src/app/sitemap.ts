import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/contact` },
    { url: `${SITE_URL}/projects` },
    ...projects.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
    { url: `${SITE_URL}/writing` },
    // Real content dates only: static pages and projects deliberately omit
    // lastModified rather than publishing a build-time or site-wide constant.
    ...posts.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: new Date(`${post.updatedAt}T00:00:00+04:00`),
    })),
  ]
}
