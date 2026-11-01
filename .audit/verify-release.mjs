import { readFile, stat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const out = 'D:/Code/GitHub/portfolio/out'
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
ok('Person has sameAs + jobTitle + address', person?.sameAs?.length >= 5 && Boolean(person.jobTitle) && person?.address?.addressLocality === 'Dubai')

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
  if (file !== '404.html') ok(`${file}: og/twitter title matches title tag`, ogTitle === title && twitterTitle === title, `og=${ogTitle} | tw=${twitterTitle} | title=${title}`)}
const home = pages.find(p => p.file === 'index.html')
ok('homepage title is name-branded', /Adam Ahsan/.test(home.title) && /bruh\.ae/.test(home.title), home.title)
ok('homepage JSON-LD has Person + WebSite', ['Person', 'WebSite'].every(t => home.types.includes(t)), home.types.join(','))
const about = pages.find(p => p.file === 'about.html')
ok('about title contains name', /Adam Ahsan/.test(about.title), about.title)
ok('about JSON-LD has ProfilePage + Person', ['ProfilePage', 'Person'].every(t => about.types.includes(t)), about.types.join(','))
const qeemat = pages.find(p => p.file === 'projects/qeemat.html')
ok('qeemat JSON-LD SoftwareApplication', qeemat.types.includes('SoftwareApplication'), qeemat.types.join(','))
const layla = pages.find(p => p.file === 'projects/layla-ai.html')
ok('layla JSON-LD CreativeWork', layla.types.includes('CreativeWork'), layla.types.join(','))
const article = pages.find(p => p.file === 'writing/ugly-truth-luxury-brands-ai-content.html')
ok('article JSON-LD Article', article.types.includes('Article'), article.types.join(','))
ok('article title includes name', /Adam Ahsan/.test(article.title), article.title)
const privacy = pages.find(p => p.file === 'track-my-salah-privacy-policy.html')
ok('privacy still noindex, follow', privacy.robots.some(r => /noindex/.test(r)) && privacy.robots.some(r => /follow/.test(r)))
const notFound = pages.find(p => p.file === '404.html')
ok('404 still noindex', notFound.robots.some(r => /noindex/.test(r)))

// 3. Raw JSON-LD structure: article author @id + dates, homepage Person @id, breadcrumb-less but valid.
const homeHtml = await readFile(join(out, 'index.html'), 'utf8')
const homeBlock = JSON.parse([...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])
ok('homepage @graph person @id', homeBlock['@graph'].some(n => n['@type'] === 'Person' && n['@id'] === 'https://bruh.ae/#person'))
const articleHtml = await readFile(join(out, 'writing/ugly-truth-luxury-brands-ai-content.html'), 'utf8')
const articleBlock = JSON.parse([...articleHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)][0][1])
ok('article author refs person @id', articleBlock.author?.['@id'] === 'https://bruh.ae/#person' && articleBlock.author?.name === 'Adam Ahsan')
ok('article dates are ISO with +04:00', /\+04:00$/.test(articleBlock.datePublished) && /\+04:00$/.test(articleBlock.dateModified))
ok('article has url + mainEntityOfPage object + isPartOf', Boolean(articleBlock.url) && typeof articleBlock.mainEntityOfPage === 'object' && Boolean(articleBlock.isPartOf?.['@id']))

// 4. Markdown frontmatter across all pages.
const markdown = {}
for (const rel of ['index', 'about', 'contact', 'projects', 'projects/layla-ai', 'projects/qeemat', 'writing', 'writing/ugly-truth-luxury-brands-ai-content', 'writing/quiet-death-saas-pricing-power', 'writing/how-a-tech-company-accidentally-becomes-political', 'track-my-salah-privacy-policy']) {
  const md = await readFile(join(out, `_markdown/${rel}.md`), 'utf8')
  const fm = md.match(/^---\n([\s\S]*?)\n---/) [1]
  markdown[rel] = fm
  ok(`md ${rel}: frontmatter has title/description/url`, ['title:', 'description:', 'url:'].every(k => fm.includes(k)))
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

// 5. llms-full + routes + headers artifacts.
const llmsFull = await readFile(join(out, 'llms-full.txt'), 'utf8')
ok('llms-full < 200KB and multi-page', Buffer.byteLength(llmsFull) < 200 * 1024 && (llmsFull.match(/\n---\n/g) || []).length >= 10, `${(Buffer.byteLength(llmsFull) / 1024).toFixed(1)} KB`)
const routes = JSON.parse(await readFile(join(out, '_routes.json'), 'utf8'))
ok('_routes.json clean routes only', routes.include.length === 11 && routes.include.every(r => r === '/' || (!r.endsWith('/') && !r.endsWith('.html'))), routes.include.join(','))
const sitemap = await readFile(join(out, 'sitemap.xml'), 'utf8')
ok('sitemap has lastmod and 10 URLs', (sitemap.match(/<lastmod>/g) || []).length === 10, String((sitemap.match(/<lastmod>/g) || []).length))
const headers = await readFile(join(out, '_headers'), 'utf8')
ok('_headers covers markdown + immutable static', headers.includes('/_markdown/*') && headers.includes('immutable') && headers.includes('X-Robots-Tag: noindex'))

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
ok('worker: Vary keeps accept-encoding + Accept', /accept-encoding/i.test(pageResponse.headers.get('Vary')) && /accept/i.test(pageResponse.headers.get('Vary')))
const mdResponse = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/markdown' } }), { ASSETS })
const mdBody = await mdResponse.text()
ok('worker: markdown negotiation from built assets', mdResponse.headers.get('Content-Type')?.startsWith('text/markdown'), mdResponse.headers.get('Content-Type'))
const homeResponse = await worker.fetch(new Request('https://bruh.ae/', { headers: { Accept: 'text/markdown' } }), { ASSETS })
const homeLink = homeResponse.headers.get('Link') ?? ''
ok('worker: homepage describedby jsonld preserved', homeLink.includes('/site-description.jsonld'))
const missing = await worker.fetch(new Request('https://bruh.ae/not-a-page', { headers: { Accept: 'text/markdown' } }), { ASSETS })
ok('worker: unknown route passthrough 404', missing.status === 404 && !missing.headers.get('Link'))
const headResponse = await worker.fetch(new Request('https://bruh.ae/about', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), { ASSETS })
ok('worker: HEAD markdown content type', headResponse.headers.get('Content-Type')?.startsWith('text/markdown'))

// 7. Broken links + sitemap resolution + no deleted asset references.
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
const laylaHtml = layla ? await readFile(join(out, 'projects/layla-ai.html'), 'utf8') : ''
ok('layla page uses webp hero', laylaHtml.includes('layla-editorial-hero-v2-900.webp') && laylaHtml.includes('layla-editorial-hero-v2-1536.webp') && laylaHtml.includes('fetchPriority="high"'))
ok('no deleted png/jpg references in html', !/layla-editorial-hero-v2\.png|layla-search-entry-v2\.png|layla-pdp-entry-v2\.png/.test(allHtml.join('\n')))

// Report.
const failed = checks.filter(c => !c.pass)
console.log(`\nCHECKS: ${checks.length} total, ${checks.length - failed.length} passed, ${failed.length} failed\n`)
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.pass ? '' : '  <<< ' + c.detail}`)
if (failed.length) process.exit(1)
