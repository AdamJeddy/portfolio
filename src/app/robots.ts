import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

/*
 * Production note: this is not necessarily the whole robots.txt that crawlers see.
 * bruh.ae has Cloudflare AI Crawl Control / Bot Preference Sync enabled, which
 * prepends a managed robots.txt block (AI training crawlers are disallowed and
 * blocked at the edge) before the rules generated here. Changes to AI-crawler
 * policy must be made in the Cloudflare dashboard and verified live with:
 *   curl -s https://bruh.ae/robots.txt
 * See README.md §Markdown for agents.
 */
