import {
  CONTENT_UPDATED,
  DEFAULT_SOCIAL_IMAGE,
  PERSON_NAME,
  PERSON_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
} from './site'

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const PROFILE_LINKS = {
  github: 'https://github.com/AdamJeddy',
  linkedin: 'https://www.linkedin.com/in/adamahsan/',
  x: 'https://x.com/A7damn',
  medium: 'https://medium.com/@uhdam',
  substack: 'https://uhwriter.substack.com/',
}

export const PROFILE_URLS = Object.values(PROFILE_LINKS)

export const personNode = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: PERSON_NAME,
  alternateName: ['Adam'],
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`,
  description: 'Adam Ahsan is a Dubai-based builder working on AI products and local-first software.',
  jobTitle: PERSON_TITLE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  knowsAbout: [
    'AI products',
    'conversational commerce',
    'product engineering',
    'local-first apps',
    'React Native',
    'Next.js',
  ],
  sameAs: PROFILE_URLS,
}

export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: PERSON_NAME,
  alternateName: ['bruh.ae', 'BRUH'],
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
}

export const personReference = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: PERSON_NAME,
  url: `${SITE_URL}/about`,
}

export function createSiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [personNode, websiteNode],
  }
}

export interface ArticleNodeInput {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
}

export function createArticleNode({
  slug,
  title,
  description,
  publishedAt,
  updatedAt,
}: ArticleNodeInput) {
  const url = `${SITE_URL}/writing/${slug}`
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    datePublished: `${publishedAt}T00:00:00+04:00`,
    dateModified: `${updatedAt}T00:00:00+04:00`,
    author: personReference,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': PERSON_ID, name: PERSON_NAME, url: SITE_URL },
  }
}

export function createArticleGraph(input: ArticleNodeInput) {
  return {
    '@context': 'https://schema.org',
    '@graph': [createArticleNode(input), personNode, websiteNode],
  }
}

export function createAboutPageGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode,
      websiteNode,
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/about#profilepage`,
        url: `${SITE_URL}/about`,
        name: 'About Adam Ahsan',
        dateModified: CONTENT_UPDATED,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
      },
    ],
  }
}

export type ProjectSlug = 'qeemat' | 'layla-ai'

/**
 * Project entities. Layla AI is an employer product that Adam Ahsan contributed
 * to (technical integration), so it is modelled as a CreativeWork with a
 * contributor, never as a work he created.
 */
export function createProjectGraph(slug: ProjectSlug, description: string) {
  const url = `${SITE_URL}/projects/${slug}`
  const entity =
    slug === 'qeemat'
      ? {
          '@type': 'SoftwareApplication',
          '@id': `${url}#software`,
          name: 'Qeemat',
          description,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Android',
          url,
          author: personReference,
          codeRepository: 'https://github.com/AdamJeddy/Qeemat',
          isPartOf: { '@id': WEBSITE_ID },
        }
      : {
          '@type': 'CreativeWork',
          '@id': `${url}#work`,
          name: 'Layla AI',
          description,
          url,
          contributor: personReference,
          isPartOf: { '@id': WEBSITE_ID },
        }
  return {
    '@context': 'https://schema.org',
    '@graph': [entity, personNode, websiteNode],
  }
}

/**
 * JSON.stringify does not escape `<`, which could close the surrounding
 * <script> element if content ever includes markup. Escape it defensively.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
