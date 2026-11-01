import { PERSON_NAME, PERSON_TITLE, SITE_DESCRIPTION, SITE_URL } from './site'

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const PROFILE_URLS = [
  'https://github.com/AdamJeddy',
  'https://www.linkedin.com/in/adamahsan/',
  'https://x.com/A7damn',
  'https://medium.com/@uhdam',
  'https://uhwriter.substack.com/',
]

export const personNode = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: PERSON_NAME,
  alternateName: ['Adam'],
  url: `${SITE_URL}/about`,
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
    '@context': 'https://schema.org',
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

export function createAboutPageGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode,
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/about#profilepage`,
        url: `${SITE_URL}/about`,
        name: 'About Adam Ahsan',
        dateModified: '2026-11-01',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
      },
    ],
  }
}

/**
 * JSON.stringify does not escape `<`, which could close the surrounding
 * <script> element if content ever includes markup. Escape it defensively.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
