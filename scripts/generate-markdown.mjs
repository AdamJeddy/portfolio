import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import domino from '@mixmark-io/domino'
import TurndownService from 'turndown'

// Cloudflare Pages caps the combined include/exclude rules in _routes.json at 100.
// Keep a safety margin so the build fails long before a growing archive reaches it.
export const MAX_ROUTE_RULES = 90

// llms-full.txt is meant to stay small enough for an agent to ingest in one request.
const MAX_LLMS_FULL_BYTES = 200 * 1024

const PERSON_TYPES = new Set(['Person'])
const WEBSITE_TYPES = new Set(['WebSite'])
const ARTICLE_TYPES = new Set(['Article', 'NewsArticle', 'BlogPosting', 'TechArticle', 'ScholarlyArticle', 'Report'])
const PAGE_TYPES = new Set(['ProfilePage', 'AboutPage', 'ContactPage', 'WebPage', 'CollectionPage', 'ItemPage', 'CreativeWork', 'SoftwareApplication'])

const PROFILE_LABELS = [
  ['github.com', 'GitHub'],
  ['linkedin.com', 'LinkedIn'],
  ['x.com', 'X'],
  ['twitter.com', 'X'],
  ['medium.com', 'Medium'],
  ['substack.com', 'Substack'],
]

const LLMS_ABOUT_NOTE = 'This file is generated at build time from the homepage structured data and each page\'s metadata, so it stays in sync with the deployed site. Every page above is also served as Markdown at the listed URL and advertised from its page response as an alternate representation; llms-full.txt concatenates the Markdown text of every page.'

export function htmlToMarkdown(html, url) {
  const document = domino.createWindow(html).document
  const main = document.querySelector('main')
  if (!main) throw new Error(`Missing main content: ${url}`)
  const structuredData = jsonLdScriptTexts(document)
  const nodes = jsonLdNodes(parseJsonLdBlocks(structuredData, url))
  const nodesById = indexNodesById(nodes)
  const article = nodes.find(node => hasType(node, ARTICLE_TYPES))
  const author = findAuthorName(article, nodesById)
  // Articles carry the dates in the contract, but page nodes (ProfilePage, CreativeWork, ...)
  // may also publish them; omit the field entirely when nothing on the page provides it.
  const datePublished = stringValue(article?.datePublished) ?? findPageNodeValue(nodes, 'datePublished') ?? firstTimeElementDate(document)
  const dateModified = stringValue(article?.dateModified) ?? findPageNodeValue(nodes, 'dateModified')
  for (const element of main.querySelectorAll('script, style, nav, footer, [hidden], [aria-hidden="true"], img[alt=""], a.signal-skip')) {
    element.remove()
  }
  for (const element of main.querySelectorAll('a[href], img[src]')) {
    const attribute = element.tagName === 'A' ? 'href' : 'src'
    element.setAttribute(attribute, new URL(element.getAttribute(attribute), url).href)
  }
  // Card links wrap headings in HTML; Markdown requires the link inside the heading.
  for (const link of main.querySelectorAll('a[href]')) {
    const heading = link.querySelector('h1, h2, h3, h4, h5, h6')
    if (!heading) continue
    const inlineLink = document.createElement('a')
    inlineLink.setAttribute('href', link.getAttribute('href'))
    while (heading.firstChild) inlineLink.appendChild(heading.firstChild)
    heading.appendChild(inlineLink)
    const container = document.createElement('div')
    while (link.firstChild) container.appendChild(link.firstChild)
    link.replaceWith(container)
  }
  // Adjacent inline elements (e.g. CTA link rows) would otherwise render as
  // `[a](u)[b](u)`; insert a space so the Markdown stays readable.
  for (const parent of [main, ...main.querySelectorAll('*')]) {
    for (let node = parent.firstChild; node; node = node.nextSibling) {
      const next = node.nextSibling
      if (isAdjacentInline(node, next)) parent.insertBefore(document.createTextNode(' '), next)
    }
  }
  const converter = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' })
  converter.addRule('definitionLists', {
    filter: ['dt', 'dd'],
    replacement: content => `\n\n${content}\n\n`,
  })
  const metadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    url,
    author,
    datePublished,
    dateModified,
    site: hostnameOf(url),
  }
  const frontmatter = buildFrontmatter(metadata)
  const jsonLd = structuredData.length ? `\n\n\`\`\`json\n${structuredData.join('\n')}\n\`\`\`` : ''
  return `---\n${frontmatter}\n---\n\n${converter.turndown(main.innerHTML)}${jsonLd}\n`
}

export async function generateMarkdown(outputDirectory) {
  const pages = {}
  const entriesByRoute = new Map()
  let homepageData
  const files = await readdir(outputDirectory, { recursive: true })
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const name = file.split(sep).join('/')
    if (name === '404.html' || name.startsWith('_not-found')) continue
    const html = await readFile(join(outputDirectory, file), 'utf8')
    const document = domino.createWindow(html).document
    if (name === 'index.html') {
      homepageData = readHomepageData(document, name)
      if (!homepageData.block) throw new Error('Homepage is missing WebSite or Person structured data')
      if (!homepageData.person) {
        console.warn('[generate-markdown] Homepage JSON-LD has no Person node; llms.txt falls back to site-level metadata.')
      }
      await writeFile(join(outputDirectory, 'site-description.jsonld'), `${JSON.stringify(homepageData.block, null, 2)}\n`)
    }
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    if (!canonical) throw new Error(`Missing canonical URL: ${file}`)
    const assetPath = `/_markdown/${name.replace(/\.html$/, '.md')}`
    const destination = join(outputDirectory, assetPath)
    await mkdir(dirname(destination), { recursive: true })
    const markdown = htmlToMarkdown(html, canonical)
    await writeFile(destination, markdown)
    const route = name === 'index.html' ? '/' : `/${name.replace(/(?:\/index)?\.html$/, '')}`
    pages[route] = assetPath
    if (route !== '/') pages[`${route}/`] = assetPath
    pages[`/${name}`] = assetPath
    entriesByRoute.set(route, {
      route,
      assetPath,
      canonical,
      markdown,
      title: toOneLine(document.title),
      description: toOneLine(document.querySelector('meta[name="description"]')?.getAttribute('content')),
    })
  }

  const entries = [...entriesByRoute.values()].sort((a, b) => {
    if (a.route === '/') return -1
    if (b.route === '/') return 1
    return a.route.localeCompare(b.route)
  })
  if (!homepageData) {
    console.warn('[generate-markdown] No homepage HTML found; llms.txt falls back to page metadata only.')
  }
  const origin = homepageOrigin(entries)
  await writeFile(join(outputDirectory, 'llms.txt'), buildLlmsTxt({
    person: homepageData?.person,
    website: homepageData?.website,
    entries,
    origin,
  }))
  const llmsFull = buildLlmsFullText(entries, homepageData)
  await writeFile(join(outputDirectory, 'llms-full.txt'), llmsFull)
  if (Buffer.byteLength(llmsFull) > MAX_LLMS_FULL_BYTES) {
    console.warn(`[generate-markdown] llms-full.txt is ${(Buffer.byteLength(llmsFull) / 1024).toFixed(1)} KB, above the ${MAX_LLMS_FULL_BYTES / 1024} KB target.`)
  }
  const worker = await readFile(new URL('../cloudflare/markdown-worker.mjs', import.meta.url), 'utf8')
  await writeFile(join(outputDirectory, '_worker.js'), `${worker}\nexport default createMarkdownWorker(${JSON.stringify(pages, null, 2)})\n`)
  await writeFile(join(outputDirectory, '_routes.json'), JSON.stringify(buildRoutes(entries.map(entry => entry.route)), null, 2))
  console.log(`Generated Markdown for ${new Set(Object.values(pages)).size} pages in ${relative(process.cwd(), outputDirectory)}.`)
}

// _routes.json only needs the clean page URLs: Cloudflare Pages 308-redirects the
// trailing-slash and .html variants before the Function is consulted.
export function buildRoutes(cleanRoutes) {
  const include = ['/', ...new Set(cleanRoutes.filter(route => route !== '/'))].sort((a, b) => a.localeCompare(b))
  if (include.length > MAX_ROUTE_RULES) {
    throw new Error(`_routes.json would contain ${include.length} include rules, over the ${MAX_ROUTE_RULES}-rule build guard (Cloudflare Pages caps include plus exclude rules at 100).`)
  }
  return { version: 1, include, exclude: [] }
}

function buildLlmsTxt({ person, website, entries, origin }) {
  const homepage = entries.find(entry => entry.route === '/')
  const heading = stringValue(person?.name) ?? stringValue(website?.name) ?? homepage?.title ?? hostnameOf(origin) ?? 'Site index'
  const summary = buildLlmsSummary(person, website)
  const profiles = profileLinks(person?.sameAs)
  const primaryEntries = entries.filter(entry => !isOptionalRoute(entry.route))
  const optionalEntries = entries.filter(entry => isOptionalRoute(entry.route))
  const lines = [`# ${heading}`, '']
  if (summary) lines.push(`> ${summary}`, '')
  if (profiles.length) {
    lines.push('## Profiles', '')
    for (const profile of profiles) lines.push(`- [${profile.label}](${profile.href})`)
    lines.push('')
  }
  lines.push('## Pages', '')
  for (const entry of primaryEntries) lines.push(pageListLine(entry, origin))
  lines.push('')
  if (optionalEntries.length) {
    lines.push('## Optional', '')
    for (const entry of optionalEntries) lines.push(pageListLine(entry, origin))
    lines.push('')
  }
  lines.push('## About this file', '', LLMS_ABOUT_NOTE, '')
  return lines.join('\n')
}

function buildLlmsSummary(person, website) {
  const sentences = []
  const name = stringValue(person?.name)
  const description = stringValue(person?.description)
  const jobTitle = stringValue(person?.jobTitle)
  const address = person?.address && typeof person.address === 'object' ? person.address : undefined
  const locality = stringValue(address?.addressLocality)
  const country = regionLabel(stringValue(address?.addressCountry))
  const location = [locality, country].filter(Boolean).join(', ')
  const identity = [name, jobTitle, location].filter(Boolean).join(', ')
  if (identity) sentences.push(ensureSentence(identity))
  if (description) sentences.push(ensureSentence(description))
  const siteDescription = stringValue(website?.description)
  if (siteDescription) sentences.push(ensureSentence(siteDescription))
  const profiles = profileLinks(person?.sameAs)
  if (profiles.length) sentences.push(`Profiles: ${profiles.map(profile => profile.label).join(', ')}.`)
  return sentences.join(' ')
}

function pageListLine(entry, origin) {
  const label = escapeLinkText(entry.title || entry.route)
  const description = entry.description ? `: ${entry.description}` : ''
  return `- [${label}](${origin}${entry.assetPath})${description}`
}

function buildLlmsFullText(entries, homepageData) {
  const included = entries.filter(entry => !isOptionalRoute(entry.route))
  const title = stringValue(homepageData?.person?.name) ?? stringValue(homepageData?.website?.name) ?? 'Site content'
  const sections = included.map(entry => {
    const body = stripFrontmatter(entry.markdown).trim()
    return `## ${entry.title || entry.route}\n\n${entry.canonical}\n\n${stripLeadingHeading(body)}`
  })
  return `# ${title}\n\n${sections.join('\n\n---\n\n')}\n`
}

function stripLeadingHeading(markdown) {
  // Remove the first ATX H1 wherever it appears, keeping any preamble. Nested
  // pages do not always start with their heading after layout nodes are stripped.
  const heading = /^# [^\n]+\n+/m.exec(markdown)
  if (!heading) return markdown
  return (markdown.slice(0, heading.index) + markdown.slice(heading.index + heading[0].length)).trim()
}

function stripFrontmatter(markdown) {
  const frontmatter = /^---\n[\s\S]*?\n---\n+/.exec(markdown)
  return frontmatter ? markdown.slice(frontmatter[0].length) : markdown
}

function isOptionalRoute(route) {
  return /privacy/i.test(route)
}

function homepageOrigin(entries) {
  const homepage = entries.find(entry => entry.route === '/')
  const candidates = [homepage?.canonical, ...entries.map(entry => entry.canonical)]
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      return new URL('/', candidate).origin
    } catch {
      // Keep looking for a parseable canonical URL.
    }
  }
  return 'https://bruh.ae'
}

function buildFrontmatter(metadata) {
  const fields = Object.entries(metadata)
    .filter(([, value]) => typeof value === 'string' && value.trim())
    .map(([key, value]) => `${key}: ${JSON.stringify(value.trim())}`)
  return fields.join('\n')
}

function jsonLdScriptTexts(document) {
  return [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(script => script.textContent.trim()).filter(Boolean)
}

function parseJsonLdBlocks(scriptTexts, url) {
  const blocks = []
  for (const text of scriptTexts) {
    try {
      blocks.push(JSON.parse(text))
    } catch {
      console.warn(`[generate-markdown] Ignoring invalid JSON-LD on ${url}`)
    }
  }
  return blocks
}

function jsonLdNodes(blocks) {
  const nodes = []
  for (const block of blocks) {
    if (Array.isArray(block)) nodes.push(...block)
    else if (block && Array.isArray(block['@graph'])) nodes.push(...block['@graph'])
    else if (block) nodes.push(block)
  }
  return nodes.filter(node => node && typeof node === 'object' && !Array.isArray(node))
}

function indexNodesById(nodes) {
  const nodesById = new Map()
  for (const node of nodes) {
    const id = stringValue(node['@id'])
    if (id) nodesById.set(id, node)
  }
  return nodesById
}

function readHomepageData(document, name) {
  const blocks = parseJsonLdBlocks(jsonLdScriptTexts(document), name)
  const nodes = jsonLdNodes(blocks)
  const block = blocks.find(candidate => {
    const candidateNodes = Array.isArray(candidate) ? candidate : candidate?.['@graph'] ?? [candidate]
    return candidateNodes.some(node => node && (hasType(node, PERSON_TYPES) || hasType(node, WEBSITE_TYPES)))
  })
  return {
    // Keep the exact graph that the homepage publishes; site-description.jsonld is its mirror.
    block,
    person: nodes.find(node => hasType(node, PERSON_TYPES)),
    website: nodes.find(node => hasType(node, WEBSITE_TYPES)),
  }
}

function findAuthorName(article, nodesById) {
  const authors = Array.isArray(article?.author) ? article.author : [article?.author]
  for (const author of authors) {
    if (typeof author === 'string') return toOneLine(author) || undefined
    if (!author || typeof author !== 'object') continue
    const referenced = nodesById.get(stringValue(author['@id']))
    const name = stringValue(author.name) ?? stringValue(referenced?.name)
    if (name) return name
  }
  return undefined
}

function findPageNodeValue(nodes, field) {
  for (const node of nodes) {
    if (!hasType(node, PAGE_TYPES)) continue
    const value = stringValue(node[field])
    if (value) return value
  }
  return undefined
}

function firstTimeElementDate(document) {
  const element = document.querySelector('main time[datetime]') ?? document.querySelector('time[datetime]')
  return stringValue(element?.getAttribute('datetime'))
}

function profileLinks(sameAs) {
  const entries = Array.isArray(sameAs) ? sameAs : sameAs ? [sameAs] : []
  const profiles = []
  for (const entry of entries) {
    const href = typeof entry === 'string' ? entry.trim() : stringValue(entry?.url)
    if (!href) continue
    const label = stringValue(entry?.name) ?? profileLabel(href)
    profiles.push({ label, href })
  }
  return profiles
}

function profileLabel(href) {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '')
    for (const [domain, label] of PROFILE_LABELS) {
      if (host === domain || host.endsWith(`.${domain}`)) return label
    }
    return host
  } catch {
    return href
  }
}

function hasType(node, types) {
  const nodeTypes = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']]
  return nodeTypes.some(type => typeof type === 'string' && types.has(type))
}

function stringValue(value) {
  if (typeof value === 'string') return toOneLine(value) || undefined
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = stringValue(item)
      if (result) return result
    }
    return undefined
  }
  if (value && typeof value === 'object') {
    return stringValue(value['@value']) ?? stringValue(value.name) ?? stringValue(value.url)
  }
  return undefined
}

function regionLabel(code) {
  if (!code || !/^[A-Z]{2}$/.test(code)) return code
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

function ensureSentence(text) {
  return /[.!?]$/.test(text) ? text : `${text}.`
}

function escapeLinkText(text) {
  return toOneLine(text).replace(/[[\]]/g, match => `\\${match}`)
}

const INLINE_TAGS = new Set(['A', 'IMG', 'SPAN', 'STRONG', 'EM', 'CODE', 'TIME', 'B', 'I', 'SMALL'])

function isAdjacentInline(node, next) {
  return Boolean(
    node &&
      next &&
      node.nodeType === 1 &&
      next.nodeType === 1 &&
      INLINE_TAGS.has(node.tagName) &&
      INLINE_TAGS.has(next.tagName),
  )
}

function toOneLine(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateMarkdown(fileURLToPath(new URL('../out/', import.meta.url)))
}
