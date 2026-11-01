// Measures the shipped static output so before/after audit deltas are measured, not estimated.
// Usage: node measure.mjs <outDir> <repoRoot>
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { brotliCompressSync } from 'node:zlib'

const outDir = process.argv[2]
const repoRoot = process.argv[3] ?? outDir
if (!outDir) throw new Error('usage: node measure.mjs <outDir> [repoRoot]')

async function walk(dir) {
  const result = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...(await walk(path)))
    else result.push(path)
  }
  return result
}

async function dirTotals(dir) {
  try {
    const files = await walk(dir)
    let bytes = 0
    for (const file of files) bytes += (await stat(file)).size
    return { files: files.length, bytes }
  } catch {
    return { files: 0, bytes: 0 }
  }
}

function unique(values) { return [...new Set(values)] }

function decodeEntities(value) {
  return value
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/g, '/')
}

function brotli(buffer) {
  try { return brotliCompressSync(buffer).length } catch { return null }
}

const files = await walk(outDir)
const htmlFiles = files.filter(file => file.endsWith('.html') && !file.endsWith('404.html') && !file.endsWith('_not-found.html'))
const pages = []
const allTypes = {}
const imageSizes = new Map()

function resolveAsset(ref, baseDir) {
  const clean = ref.split('#')[0].split('?')[0]
  if (!clean || clean.startsWith('http') || clean.startsWith('//')) return null
  const file = join(outDir, clean.replace(/^\//, ''))
  return file
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const pick = (re) => (html.match(re) || [])[1] ?? ''
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => {
    try { return JSON.parse(m[1]) } catch { return 'INVALID' }
  })
  const nodeTypes = []
  for (const block of ld) {
    if (block === 'INVALID' || !block) { nodeTypes.push('INVALID'); continue }
    const nodes = block['@graph'] ?? [block]
    for (const node of nodes) {
      const types = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']]
      for (const type of types) if (type) { nodeTypes.push(type); allTypes[type] = (allTypes[type] ?? 0) + 1 }
    }
  }
  const imageRefs = []
  for (const match of html.matchAll(/(?:src|srcSet)="([^"]+)"/g)) {
    for (const part of match[1].split(',')) {
      const ref = part.trim().split(/\s+/)[0]
      const asset = resolveAsset(ref)
      if (asset && /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(asset)) imageRefs.push(asset)
    }
  }
  const images = unique(imageRefs)
  let imageBytes = 0
  for (const image of images) {
    if (!imageSizes.has(image)) imageSizes.set(image, (await stat(image).catch(() => ({ size: 0 }))).size)
    imageBytes += imageSizes.get(image)
  }
  const title = decodeEntities(pick(/<title>([^<]*)<\/title>/))
  const description = decodeEntities(pick(/<meta name="description" content="([^"]*)"/))
  const ogTitle = decodeEntities(pick(/property="og:title" content="([^"]*)"/))
  const twitterTitle = decodeEntities(pick(/name="twitter:title" content="([^"]*)"/))
  pages.push({
    page: relative(outDir, file).split('\\').join('/'),
    title,
    titleLength: title.length,
    descriptionLength: description.length,
    ogTitleMatchesTitle: ogTitle === title,
    nameInTitle: /Adam Ahsan/.test(title),
    nameInDescription: /Adam Ahsan/.test(description),
    nameInOgTitle: /Adam Ahsan/.test(ogTitle),
    nameInStructuredData: JSON.stringify(ld).includes('Adam Ahsan'),
    canonical: pick(/rel="canonical" href="([^"]*)"/),
    robots: (html.match(/name="robots" content="([^"]*)"/) || [])[1] ?? '',
    h1Count: (html.match(/<h1[\s>]/g) || []).length,
    nodeTypes,
    imageBytes,
    imageCount: images.length,
  })
}

const home = await readFile(join(outDir, 'index.html'), 'utf8')
const fontPreloads = (home.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) || [])
let fontPreloadBytes = 0
for (const tag of fontPreloads) {
  const href = (tag.match(/href="([^"]+)"/) || [])[1]
  const asset = href ? resolveAsset(href) : null
  if (asset) fontPreloadBytes += (await stat(asset).catch(() => ({ size: 0 }))).size
}

const jsChunks = unique([...home.matchAll(/(\/_next\/static\/chunks\/[^"']+\.js)/g)].map(m => m[1]))
let jsBytes = 0
let jsBuffer = Buffer.alloc(0)
for (const chunk of jsChunks) {
  const content = await readFile(join(outDir, chunk)).catch(() => Buffer.alloc(0))
  jsBytes += content.length
  jsBuffer = Buffer.concat([jsBuffer, content])
}
const cssChunks = unique([...home.matchAll(/(\/_next\/static\/[^"']+\.css)/g)].map(m => m[1]))
let cssBytes = 0
let cssBuffer = Buffer.alloc(0)
for (const chunk of cssChunks) {
  const content = await readFile(join(outDir, chunk)).catch(() => Buffer.alloc(0))
  cssBytes += content.length
  cssBuffer = Buffer.concat([cssBuffer, content])
}

const mdDir = join(outDir, '_markdown')
const mdFiles = (await walk(mdDir).catch(() => [])).filter(file => file.endsWith('.md'))
let mdBytes = 0
let mdFrontmatterAuthor = 0
let mdFrontmatterDates = 0
let mdConcatBugs = 0
let mdSkipLinks = 0
for (const file of mdFiles) {
  const text = await readFile(file, 'utf8')
  mdBytes += Buffer.byteLength(text)
  if (/^author:/m.test(text)) mdFrontmatterAuthor++
  if (/^datePublished:/m.test(text) || /^dateModified:/m.test(text)) mdFrontmatterDates++
  if (/\d{2}(January|February|March|April|May|June|July|August|September|October|November|December)|By Adam\d{4}|\d{4}\d+ min read/.test(text)) mdConcatBugs++
  if (/\[Skip to selected work\]/.test(text)) mdSkipLinks++
}

const llms = await readFile(join(outDir, 'llms.txt'), 'utf8').catch(() => '')
const llmsFull = await readFile(join(outDir, 'llms-full.txt'), 'utf8').catch(() => '')
const routes = JSON.parse(await readFile(join(outDir, '_routes.json'), 'utf8').catch(() => '{"version":1,"include":[],"exclude":[]}'))
const sitemap = await readFile(join(outDir, 'sitemap.xml'), 'utf8').catch(() => '')
const worker = await readFile(join(outDir, '_worker.js'), 'utf8').catch(() => '')
const siteDescription = await readFile(join(outDir, 'site-description.jsonld'), 'utf8').catch(() => '')
const homeGraphTypes = (() => {
  try {
    const block = JSON.parse([...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])
    return (block['@graph'] ?? [block]).map(node => node['@type'])
  } catch { return [] }
})()

const result = {
  out: await dirTotals(outDir),
  outImages: await dirTotals(join(outDir, 'images')),
  publicImages: await dirTotals(join(repoRoot, 'public', 'images')),
  pages: pages.length,
  pageTable: pages.map(p => ({
    page: p.page, title: p.title, titleLength: p.titleLength, descriptionLength: p.descriptionLength,
    nameInTitle: p.nameInTitle, nameInDescription: p.nameInDescription, nameInOgTitle: p.nameInOgTitle,
    ogTitleMatchesTitle: p.ogTitleMatchesTitle, h1Count: p.h1Count, robots: p.robots,
    nodeTypes: p.nodeTypes.join('+'), imageCount: p.imageCount, imageBytes: p.imageBytes,
  })),
  schemaTypeCounts: allTypes,
  homepageGraphTypes: homeGraphTypes,
  nameCoverage: {
    pages: pages.length,
    pagesWithNameInTitle: pages.filter(p => p.nameInTitle).length,
    pagesWithNameInDescription: pages.filter(p => p.nameInDescription).length,
    pagesWithNameInOgTitle: pages.filter(p => p.nameInOgTitle).length,
    pagesWithStructuredData: pages.filter(p => p.nodeTypes.length > 0).length,
    pagesWithAdamAhsanInStructuredData: pages.filter(p => p.nameInStructuredData).length,
  },
  titleLengthOver60: pages.filter(p => p.titleLength > 60).length,
  fontPreloads: fontPreloads.length,
  fontPreloadBytes,
  jsChunks: jsChunks.length,
  jsBytes,
  jsBrotli: brotli(jsBuffer),
  cssChunks: cssChunks.length,
  cssBytes,
  cssBrotli: brotli(cssBuffer),
  markdown: {
    files: mdFiles.length, bytes: mdBytes,
    withAuthor: mdFrontmatterAuthor, withDates: mdFrontmatterDates,
    concatBugs: mdConcatBugs, skipLinkNoise: mdSkipLinks,
  },
  llms: { exists: llms.length > 0, bytes: Buffer.byteLength(llms), lines: llms.split('\n').length, hasPersonHeading: /^# Adam Ahsan/m.test(llms), hasProfiles: /## Profiles/.test(llms), hasPages: /## Pages/.test(llms), markdownLinks: (llms.match(/_markdown\//g) || []).length },
  llmsFull: { exists: llmsFull.length > 0, bytes: Buffer.byteLength(llmsFull), sections: (llmsFull.match(/\n---\n/g) || []).length + 1 },
  routes: { include: routes.include?.length ?? 0, hasHtmlVariants: (routes.include ?? []).some(r => /\.html$/.test(r) || (r !== '/' && r.endsWith('/'))) },
  sitemapLastmodCount: (sitemap.match(/<lastmod>/g) || []).length,
  sitemapUrls: (sitemap.match(/<loc>/g) || []).length,
  siteDescription: { bytes: Buffer.byteLength(siteDescription), hasPerson: siteDescription.includes('"Person"'), hasWebsite: siteDescription.includes('"WebSite"') },
  worker: {
    hasAlternateLink: worker.includes('rel="alternate"') && worker.includes('text/markdown'),
    hasLlmsDescribedby: worker.includes("/llms.txt") && worker.includes('describedby'),
    securityHeaders: ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options'].filter(h => worker.includes(h)).length,
    hasJsonLdDescribedby: worker.includes('/site-description.jsonld'),
  },
}
const json = JSON.stringify(result, null, 2)
const outputFile = process.argv[4]
if (outputFile) {
  await writeFile(outputFile, `${json}\n`)
  console.log(`WROTE ${outputFile}`)
} else {
  console.log(json)
}
