import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const repoRoot = 'D:/Code/GitHub/portfolio'
const out = join(repoRoot, 'out')
const checks = []
const ok = (name, pass, detail = '') => checks.push({ name, pass, detail })

// 1. Encoding sanity: em dash must be stored as a real U+2014, not mojibake bytes.
const llms = await readFile(join(out, 'llms.txt'), 'utf8')
ok('llms.txt has real em dash', llms.includes('\u2014') && !llms.includes('\u00e2\u20ac\u201d'))
ok('llms.txt starts with # Adam Ahsan', llms.startsWith('# Adam Ahsan'))
ok('llms.txt has Profiles + Pages + Optional', ['## Profiles', '## Pages', '## Optional'].every(s => llms.includes(s)))
ok('llms.txt links markdown entry points', /https:\/\/bruh\.ae\/_markdown\/index\.md/.test(llms))

const siteDescription = JSON.parse(await readFile(join(out, 'site-description.jsonld'), 'utf8'))
const graph = siteDescription['@graph'] ?? []
const person = graph.find(n => n['@type'] === 'Person')
const website = graph.find(n => n['@type'] === 'WebSite')
ok('site-description has Person graph', Boolean(person) && Boolean(website))
ok('Person has sameAs + jobTitle + address + image', person?.sameAs?.length >= 5 && Boolean(person.jobTitle) && person?.address?.addressLocality === 'Dubai' && Boolean(person.image))

// 2. Every HTML page: title/description/canonical/robots/h1/JSON-LD.
const htmlFiles = ['index.html', 'about.html', 'contact.html', 'projects.html', 'projects/layla-ai.html', 'projects/qeemat.html', 'writing.html', 'writing/how-a-tech-company-accidentally-becomes-political.html', 'writing/quiet-death-saas-pricing-power.html', 'writing/ugly-truth-luxury-brands-ai-content.html', 'track-my-salah-privacy-policy.html', '404.html']
const pages = []
for (const file of htmlFiles) {
  const html = await readFile(join(out, file), 'utf8')
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? ''
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] ?? ''
  const canonical = (html.match(/rel="canonical" href="([^"]*)"/) || [])[1] ?? ''
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map(m => m[1])
  const ogTitle = (html.match(/property="og:title" content="([^"]*)"/) || [])[1] ?? ''
  const twitterTitle = (html.match(/name="twitter:title" content="([^"]*)"/) || [])[1] ?? ''
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]) } catch { return 'INVALID' } })
  const types = ld.flatMap(block => (block['@graph'] ?? [block]).map(n => n?.['@type'])).filter(Boolean)
  pages.push({ file, title, desc, canonical, h1, robots, types })
  if (file !== '404.html') ok(`${file}: title/desc/canonical`, Boolean(title) && Boolean(desc) && Boolean(canonical), `${title} | ${desc.length} chars`)
  if (file !== '404.html') ok(`${file}: exactly one h1`, h1 === 1, String(h1))
  if (file !== '404.html') ok(`${file}: og/twitter title matches title tag`, ogTitle === title && twitterTitle === title, `og=${ogTitle} | tw=${twitterTitle} | title=${title}`)
}
const pageByFile = Object.fromEntries(pages.map(page => [page.file, page]))
const home = pageByFile['index.html']
ok('homepage title is name-branded', /Adam Ahsan/.test(home.title) && /bruh\.ae/.test(home.title), home.title)
ok('homepage JSON-LD has Person + WebSite', ['Person', 'WebSite'].every(t => home.types.includes(t)), home.types.join(','))
const about = pageByFile['about.html']
ok('about title contains name', /Adam Ahsan/.test(about.title), about.title)
ok('about JSON-LD has ProfilePage + Person', ['ProfilePage', 'Person'].every(t => about.types.includes(t)), about.types.join(','))
const qeemat = pageByFile['projects/qeemat.html']
ok('qeemat JSON-LD SoftwareApplication', qeemat.types.includes('SoftwareApplication'), qeemat.types.join(','))
const layla = pageByFile['projects/layla-ai.html']
ok('layla JSON-LD CreativeWork', layla.types.includes('CreativeWork'), layla.types.join(','))
const article = pageByFile['writing/ugly-truth-luxury-brands-ai-content.html']
ok('article JSON-LD Article', article.types.includes('Article'), article.types.join(','))
ok('article title includes name', /Adam Ahsan/.test(article.title), article.title)
ok('index titles are descriptive', about.title.includes('Dubai Product') && pageByFile['contact.html'].title.includes('bruh.ae') && pageByFile['projects.html'].title.includes('Layla AI') && pageByFile['writing.html'].title.includes('AI, Product'))
const privacy = pageByFile['track-my-salah-privacy-policy.html']
ok('privacy still noindex, follow', privacy.robots.some(r => /noindex/.test(r)) && privacy.robots.some(r => /follow/.test(r)))
const notFound = pageByFile['404.html']
ok('404 still noindex', notFound.robots.some(r => /noindex/.test(r)))

// 3. Raw JSON-LD structure: connected graph on every page that references entities.
const homeHtml = await readFile(join(out, 'index.html'), 'utf8')
const homeBlock = JSON.parse([...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])
ok('homepage @graph person @id', homeBlock['@graph'].some(n => n['@type'] === 'Person' && n['@id'] === 'https://bruh.ae/#person'))
const homePerson = (homeBlock['@graph'] ?? [homeBlock]).find(node => node['@type'] === 'Person')
ok('Person has an image', Boolean(homePerson?.image))
const aboutHtml = await readFile(join(out, 'about.html'), 'utf8')
const aboutBlock = JSON.parse([...aboutHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])
const aboutNodes = aboutBlock['@graph'] ?? [aboutBlock]
const profilePage = aboutNodes.find(node => node['@type'] === 'ProfilePage')
ok('ProfilePage dateModified uses the content date', profilePage?.dateModified === '2026-11-01', profilePage?.dateModified)
const articleHtml = await readFile(join(out, 'writing/ugly-truth-luxury-brands-ai-content.html'), 'utf8')
const articleBlocks = [...articleHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]))
const articleNodes = articleBlocks.flatMap(block => block['@graph'] ?? [block])
const articleBlock = articleNodes.find(node => node['@type'] === 'Article')
ok('article author refs person @id', articleBlock?.author?.['@id'] === 'https://bruh.ae/#person' && articleBlock?.author?.name === 'Adam Ahsan')
ok('article dates are ISO with +04:00', /\+04:00$/.test(articleBlock?.datePublished) && /\+04:00$/.test(articleBlock?.dateModified))
ok('article has url + mainEntityOfPage object + isPartOf', Boolean(articleBlock?.url) && typeof articleBlock?.mainEntityOfPage === 'object' && Boolean(articleBlock?.isPartOf?.['@id']))
const graphPages = pages.filter(page => /Article|ProfilePage|SoftwareApplication|CreativeWork/.test(page.types.join(',')))
for (const page of graphPages) {
  ok(`${page.file}: graph resolves @person and @website`, ['Person', 'WebSite'].every(type => page.types.includes(type)), page.types.join(','))
}

// 4. Markdown frontmatter and extraction quality.
const markdownPages = ['index', 'about', 'contact', 'projects', 'projects/layla-ai', 'projects/qeemat', 'writing', 'writing/ugly-truth-luxury-brands-ai-content', 'writing/quiet-death-saas-pricing-power', 'writing/how-a-tech-company-accidentally-becomes-political', 'track-my-salah-privacy-policy']
const markdown = {}
for (const rel of markdownPages) {
  const md = await readFile(join(out, `_markdown/${rel}.md`), 'utf8')
  const fm = md.match(/^---\n([\s\S]*?)\n---/)[1]
  markdown[rel] = fm
  ok(`md ${rel}: frontmatter has title/description/url`, ['title:', 'description:', 'url:'].every(k => fm.includes(k)))
  ok(`md ${rel}: adjacent inline links are separated`, !/\]\(https?:\/\/[^)]+\)\[/.test(md.replace(/^---[\s\S]*?---\n+/, '')))
}
ok('md article: author + dates in frontmatter', ['author: "Adam Ahsan"', 'datePublished:', 'dateModified:'].every(k => markdown['writing/ugly-truth-luxury-brands-ai-content'].includes(k)))
ok('md about: dateModified in frontmatter', markdown.about.includes('dateModified:'))
ok('md homepage: no fabricated dates', !markdown.index.includes('datePublished'))
const aboutMd = await readFile(join(out, '_markdown/about.md'), 'utf8')
ok('md about H1 has space between name and role', /^# Adam Ahsan The person behind/m.test(aboutMd), aboutMd.match(/^# .*/m)?.[0])
const articleMd = await readFile(join(out, '_markdown/writing/ugly-truth-luxury-brands-ai-content.md'), 'utf8')
ok('md article ledger date no concatenation', /Commentary \/ 02\n\nJanuary 17, 2026 \/ 3 min read/.test(articleMd))
ok('md article byline no concatenation', /By \[Adam Ahsan\]\(https:\/\/bruh\.ae\/about\)\n\n2026 \/ 3 min read/.test(articleMd))
const homeMd = await readFile(join(out, '_markdown/index.md'), 'utf8')
ok('md homepage contains name + brand sentence', homeMd.includes('Adam Ahsan') && homeMd.includes('bruh.ae'))
ok('md homepage skip-link removed', !homeMd.includes('[Skip to selected work]'))

// 5. llms-full + routes + sitemap + headers.
const llmsFull = await readFile(join(out, 'llms-full.txt'), 'utf8')
ok('llms-full < 200KB and 10 page sections', Buffer.byteLength(llmsFull) < 200 * 1024 && (llmsFull.match(/\n---\n/g) || []).length === 9, `${(Buffer.byteLength(llmsFull) / 1024).toFixed(1)} KB`)
ok('llms-full has exactly one top-level H1', (llmsFull.match(/^# /gm) || []).length === 1, String((llmsFull.match(/^# /gm) || []).length))
ok('llms-full excludes the noindex privacy page', !/Track My Salah/.test(llmsFull))
ok('llms-full uses per-page H2 headings', llmsFull.includes('## About Adam Ahsan'))
const routes = JSON.parse(await readFile(join(out, '_routes.json'), 'utf8'))
ok('_routes.json clean routes only', routes.include.length === 11 && routes.include.every(r => r === '/' || (!r.endsWith('/') && !r.endsWith('.html'))), routes.include.join(','))
const sitemap = await readFile(join(out, 'sitemap.xml'), 'utf8')
ok('sitemap has 10 URLs', (sitemap.match(/<loc>/g) || []).length === 10, String((sitemap.match(/<loc>/g) || []).length))
ok('sitemap lastmod only where a real date exists', (sitemap.match(/<lastmod>/g) || []).length === 3, String((sitemap.match(/<lastmod>/g) || []).length))
ok('sitemap omits ignored changefreq/priority', !/<changefreq>/.test(sitemap) && !/<priority>/.test(sitemap))
const headers = await readFile(join(out, '_headers'), 'utf8')
ok('_headers covers markdown/static security/immutable', headers.includes('/_markdown/*') && headers.includes('immutable') && headers.includes('X-Robots-Tag: noindex') && headers.includes('X-Content-Type-Options') && headers.includes('X-Frame-Options'))

// 6. Built worker end-to-end against out/ assets.
const workerModule = await import(pathToFileURL(join(out, '_worker.js')).href)
const worker = workerModule.default
const ASSETS = {
  async fetch(request) {
    const url = new URL(request.url)
    let path = decodeURIComponent(url.pathname)
    if (path.endsWith('/')) path += 'index.html'
    else if (!path.split('/').pop().includes('.')) path += '.html'
    const file = join(out, path)
    try {
      const body = request.method === 'HEAD' ? null : await readFile(file)
      const type = file.endsWith('.md') ? 'text/markdown' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream'
      return new Response(body, { status: 200, headers: { 'Content-Type': type, ETag: 'W/"x"', Vary: 'accept-encoding', 'X-Existing': 'kept' } })
    } catch {
      return new Response('not found', { status: 404, headers: { 'Content-Type': 'text/html' } })
    }
  },
}
const pageResponse = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/html' } }), { ASSETS })
const pageHtml = await pageResponse.text()
ok('worker HTML: page rendered from built asset', pageHtml.includes('Adam Ahsan') && pageResponse.headers.get('Content-Type')?.includes('text/html'))
const link = pageResponse.headers.get('Link') ?? ''
ok('worker: alternate markdown Link', link.includes('https://bruh.ae/_markdown/about.md') && link.includes('rel="alternate"') && link.includes('type="text/markdown"'), link)
ok('worker: describedby llms.txt Link', link.includes('</llms.txt>; rel="describedby"'))
ok('worker: security headers on page', ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options'].every(h => pageResponse.headers.get(h)))
ok('worker: content signal header on pages', pageResponse.headers.get('Content-Signal') === 'search=yes, ai-train=no, use=reference', pageResponse.headers.get('Content-Signal'))
ok('worker: Vary keeps accept-encoding + Accept', /accept-encoding/i.test(pageResponse.headers.get('Vary')) && /accept/i.test(pageResponse.headers.get('Vary')))
const mdResponse = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/markdown' } }), { ASSETS })
ok('worker: markdown negotiation from built assets', mdResponse.headers.get('Content-Type')?.startsWith('text/markdown'), mdResponse.headers.get('Content-Type'))
ok('worker: markdown variant is cache-private', mdResponse.headers.get('Cache-Control') === 'private, max-age=0, must-revalidate', mdResponse.headers.get('Cache-Control'))
ok('worker: content-location on negotiated markdown', mdResponse.headers.get('Content-Location') === 'https://bruh.ae/_markdown/about.md', mdResponse.headers.get('Content-Location'))
ok('worker: HTML keeps the asset cache policy', pageResponse.headers.get('Cache-Control') === null, pageResponse.headers.get('Cache-Control'))
const homeResponse = await worker.fetch(new Request('https://bruh.ae/', { headers: { Accept: 'text/markdown' } }), { ASSETS })
const homeLink = homeResponse.headers.get('Link') ?? ''
ok('worker: homepage describedby jsonld preserved', homeLink.includes('/site-description.jsonld'))
const missing = await worker.fetch(new Request('https://bruh.ae/not-a-page', { headers: { Accept: 'text/markdown' } }), { ASSETS })
ok('worker: unknown route passthrough 404', missing.status === 404 && !missing.headers.get('Link'))
const headResponse = await worker.fetch(new Request('https://bruh.ae/about', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), { ASSETS })
ok('worker: HEAD markdown content type', headResponse.headers.get('Content-Type')?.startsWith('text/markdown'))

// 7. Broken links, image references, stale files.
const allHtml = await Promise.all(htmlFiles.map(f => readFile(join(out, f), 'utf8')))
const broken = []
for (const html of allHtml) {
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let url = m[1]
    if (!url.startsWith('/') || url.startsWith('//')) continue
    url = url.split('#')[0].split('?')[0]
    if (!url) continue
    const rel = url.replace(/^\//, '')
    const candidates = url === '/' ? [join(out, 'index.html')] : [join(out, rel), join(out, rel + '.html'), join(out, rel, 'index.html')]
    let exists = false
    for (const c of candidates) { try { await stat(c); exists = true; break } catch {} }
    if (!exists) broken.push(url)
  }
}
ok('no broken internal links', broken.length === 0, broken.slice(0, 5).join(','))
const laylaHtml = await readFile(join(out, 'projects/layla-ai.html'), 'utf8')
ok('layla page uses webp hero', laylaHtml.includes('layla-editorial-hero-v2-900.webp') && laylaHtml.includes('layla-editorial-hero-v2-1536.webp') && laylaHtml.includes('fetchPriority="high"'))
ok('no deleted png/jpg references in html', !/layla-editorial-hero-v2\.png|layla-search-entry-v2\.png|layla-pdp-entry-v2\.png/.test(allHtml.join('\n')))
const stalePaths = ['tailwind.config.js', 'postcss.config.js', 'index.html.old', 'dist/index.html', '.nojekyll', 'src/components/TextCanvas.tsx', 'src/components/Reveal.tsx', 'src/components/BrutalButton.tsx', 'src/hooks/useTheme.ts', 'src/hooks/useReveal.ts', 'src/components/media/ProjectHero.tsx', 'public/images/layla-ai/layla-ai-experience.webp']
const staleRemaining = []
for (const stalePath of stalePaths) {
  try { await stat(join(repoRoot, stalePath)); staleRemaining.push(stalePath) } catch { /* removed */ }
}
ok('dead configs/components/assets removed', staleRemaining.length === 0, staleRemaining.join(','))

// Report.
const failed = checks.filter(c => !c.pass)
console.log(`\nCHECKS: ${checks.length} total, ${checks.length - failed.length} passed, ${failed.length} failed\n`)
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.pass ? '' : '  <<< ' + c.detail}`)
if (failed.length) process.exit(1)
