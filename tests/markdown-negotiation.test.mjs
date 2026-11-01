import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMarkdownWorker } from '../cloudflare/markdown-worker.mjs'
import { MAX_ROUTE_RULES, buildRoutes, generateMarkdown, htmlToMarkdown } from '../scripts/generate-markdown.mjs'

const pages = { '/about': '/_markdown/about.md', '/about/': '/_markdown/about.md' }

const homepageGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://bruh.ae/#person',
      name: 'Adam Ahsan',
      url: 'https://bruh.ae/about',
      description: 'Adam Ahsan is a Dubai-based builder working on AI products and software.',
      jobTitle: 'Builder',
      address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
      sameAs: [
        'https://github.com/AdamJeddy',
        'https://www.linkedin.com/in/adamahsan/',
        'https://x.com/A7damn',
        'https://medium.com/@uhdam',
        'https://uhwriter.substack.com/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://bruh.ae/#website',
      url: 'https://bruh.ae',
      name: 'Adam Ahsan',
      alternateName: ['bruh.ae', 'BRUH'],
      description: "bruh.ae is Adam Ahsan's personal portfolio: selected projects, commentary, and experiments.",
    },
  ],
}

function pageHtml({ title, description, canonical, jsonLd, main = '<h1>Page</h1>', extraHead = '' }) {
  const meta = description ? `<meta name="description" content="${description}">` : ''
  const structuredData = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''
  return `<!doctype html><html><head><title>${title}</title>${meta}<link rel="canonical" href="${canonical}">${extraHead}</head><body>${structuredData}<main>${main}</main></body></html>`
}

test('advertises the site description on homepage HTML and Markdown while preserving existing links', async () => {
  const worker = createMarkdownWorker({ '/': '/_markdown/index.md', ...pages })
  const ASSETS = { fetch: async () => new Response('content', { headers: { Link: '</existing>; rel="preload"' } }) }
  for (const accept of ['text/html', 'text/markdown']) {
    const response = await worker.fetch(new Request('https://bruh.ae/', { headers: { Accept: accept } }), { ASSETS })
    assert.match(response.headers.get('Link'), /<\/existing>; rel="preload"/)
    assert.match(response.headers.get('Link'), /<\/site-description\.jsonld>; rel="describedby"; type="application\/ld\+json"/)
  }
  const other = await worker.fetch(new Request('https://bruh.ae/about'), { ASSETS })
  assert.match(other.headers.get('Link'), /<\/llms\.txt>; rel="describedby"/)
  assert.doesNotMatch(other.headers.get('Link'), /site-description\.jsonld/)
})

test('advertises absolute Markdown alternates and the llms.txt index on every mapped page response', async () => {
  const worker = createMarkdownWorker({ '/': '/_markdown/index.md', ...pages, '/about.html': '/_markdown/about.md' })
  const ASSETS = { fetch: async () => new Response('content') }
  for (const pathname of ['/about', '/about/', '/about.html']) {
    const response = await worker.fetch(new Request(`https://bruh.ae${pathname}`), { ASSETS })
    const link = response.headers.get('Link')
    assert.match(link, /<https:\/\/bruh\.ae\/_markdown\/about\.md>; rel="alternate"; type="text\/markdown"/)
    assert.match(link, /<\/llms\.txt>; rel="describedby"; type="text\/plain"/)
    assert.doesNotMatch(link, /site-description\.jsonld/)
  }
  const response = await worker.fetch(new Request('https://bruh.ae/', { headers: { Accept: 'text/markdown' } }), { ASSETS })
  const link = response.headers.get('Link')
  assert.match(link, /<https:\/\/bruh\.ae\/_markdown\/index\.md>; rel="alternate"; type="text\/markdown"/)
  assert.match(link, /<\/llms\.txt>; rel="describedby"; type="text\/plain"/)
  assert.match(link, /<\/site-description\.jsonld>; rel="describedby"; type="application\/ld\+json"/)
  assert.ok(link.indexOf('rel="alternate"') < link.indexOf('</llms.txt>'), 'alternate link comes before describedby links')
  assert.ok(link.indexOf('</llms.txt>') < link.indexOf('</site-description.jsonld>'), 'llms.txt comes before the JSON-LD description')
})

test('adds security headers to page responses but not static assets', async () => {
  const worker = createMarkdownWorker({ ...pages })
  const ASSETS = { fetch: async () => new Response('content') }
  const response = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/markdown' } }), { ASSETS })
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
  assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin')
  assert.equal(response.headers.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()')
  assert.equal(response.headers.get('X-Frame-Options'), 'DENY')
  const asset = await worker.fetch(new Request('https://bruh.ae/_next/static/app.js', { headers: { Accept: 'text/markdown' } }), { ASSETS })
  for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options']) {
    assert.equal(asset.headers.get(header), null, `${header} should not be added to static asset responses`)
  }
})

function assets() {
  const requests = []
  return {
    requests,
    async fetch(request) {
      requests.push(request)
      const markdown = new URL(request.url).pathname.endsWith('.md')
      return new Response(request.method === 'HEAD' ? null : markdown ? '# About\n' : '<h1>About</h1>', {
        headers: { 'Content-Type': markdown ? 'text/plain' : 'text/html', Vary: 'Accept-Encoding', 'X-Content-Type-Options': 'nosniff' },
      })
    },
  }
}

test('serves Markdown at the same URL and preserves other Vary dimensions and security headers', async () => {
  const ASSETS = assets()
  const response = await createMarkdownWorker(pages).fetch(new Request('https://bruh.ae/about?ref=agent', {
    headers: { Accept: 'text/markdown' },
  }), { ASSETS })
  assert.equal(response.headers.get('Content-Type'), 'text/markdown; charset=utf-8')
  assert.equal(response.headers.get('Vary'), 'Accept-Encoding, Accept')
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
  assert.equal(await response.text(), '# About\n')
  assert.equal(new URL(ASSETS.requests[0].url).pathname, '/_markdown/about.md')
})

for (const accept of [null, '*/*', 'text/html', 'text/markdown;q=0', 'text/markdown;q=0.2, text/html;q=0.9', 'text/markdown-fake']) {
  test(`keeps HTML for Accept: ${accept}`, async () => {
    const response = await createMarkdownWorker(pages).fetch(new Request('https://bruh.ae/about', {
      headers: accept ? { Accept: accept } : {},
    }), { ASSETS: assets() })
    assert.match(response.headers.get('Content-Type'), /text\/html/)
    assert.match(response.headers.get('Vary'), /Accept/)
    assert.equal(await response.text(), '<h1>About</h1>')
  })
}

for (const accept of ['text/html;q=0.5, text/markdown', 'TEXT/MARKDOWN; charset=utf-8', 'text/html, text/markdown', 'text/*;q=0.5, text/markdown;q=0.8']) {
  test(`negotiates Markdown for Accept: ${accept}`, async () => {
    const response = await createMarkdownWorker(pages).fetch(new Request('https://bruh.ae/about/', {
      headers: { Accept: accept },
    }), { ASSETS: assets() })
    assert.equal(await response.text(), '# About\n')
  })
}

test('supports HEAD and leaves unknown routes, assets, and other methods to the asset server', async () => {
  const worker = createMarkdownWorker(pages)
  const ASSETS = assets()
  const response = await worker.fetch(new Request('https://bruh.ae/about', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), { ASSETS })
  assert.match(response.headers.get('Content-Type'), /text\/markdown/)
  assert.equal(await response.text(), '')
  for (const [path, method] of [['/missing', 'GET'], ['/_next/app.js', 'GET'], ['/about', 'POST'], ['/toString', 'GET']]) {
    await worker.fetch(new Request(`https://bruh.ae${path}`, { method, headers: { Accept: 'text/markdown' } }), { ASSETS })
    assert.equal(new URL(ASSETS.requests.at(-1).url).pathname, path)
  }
})

test('preserves Markdown asset validators and does not label errors as Markdown', async () => {
  const worker = createMarkdownWorker(pages)
  const request = new Request('https://bruh.ae/about', { headers: { Accept: 'text/markdown', 'If-None-Match': '"markdown-version"' } })
  const response = await worker.fetch(request, { ASSETS: {
    async fetch(assetRequest) {
      assert.equal(assetRequest.headers.get('If-None-Match'), '"markdown-version"')
      return new Response(null, { status: 304, headers: { ETag: '"markdown-version"', Vary: '*' } })
    },
  } })
  assert.equal(response.status, 304)
  assert.equal(response.headers.get('ETag'), '"markdown-version"')
  assert.equal(response.headers.get('Vary'), '*')
  const missing = await worker.fetch(request, { ASSETS: {
    fetch: async () => new Response('Missing asset', { status: 404, headers: { 'Content-Type': 'text/plain' } }),
  } })
  assert.equal(missing.status, 404)
  assert.equal(missing.headers.get('Content-Type'), 'text/plain')
  assert.equal(missing.headers.get('Link'), null)
})

test('converts main content with metadata, headings, lists and absolute links, stripping layout and scripts', () => {
  const markdown = htmlToMarkdown(`<!doctype html><html><head><title>About &amp; work</title><meta name="description" content="A short bio."></head><body>
    <nav>Global navigation</nav><main><header><h1>About Adam</h1><p>Article introduction.</p></header>
    <h2>Projects</h2><ul><li><a href="/projects/qeemat">Qeemat</a></li></ul>
    <p>Technology &amp; creativity.</p><span aria-hidden="true">Decoration</span>
    <nav>Section navigation</nav><script>secretScript()</script><style>.dense{}</style>
    </main><footer>Global footer</footer><script type="application/ld+json">{"@type":"Person"}</script></body></html>`, 'https://bruh.ae/about')
  assert.match(markdown, /title: "About & work"/)
  assert.match(markdown, /description: "A short bio\."/)
  assert.match(markdown, /# About Adam/)
  assert.match(markdown, /Article introduction\./)
  assert.match(markdown, /## Projects/)
  assert.match(markdown, /-\s+\[Qeemat\]\(https:\/\/bruh.ae\/projects\/qeemat\)/)
  assert.match(markdown, /Technology & creativity\./)
  assert.match(markdown, /```json\n\{"@type":"Person"\}/)
  assert.doesNotMatch(markdown, /Global navigation|Global footer|Decoration|Section navigation|secretScript|dense|<\/?(?:html|main|script)/)
})

test('renders linked card headings as valid inline Markdown links', () => {
  const markdown = htmlToMarkdown('<html><head><title>Projects</title></head><body><main><a href="/projects/qeemat"><h2>Qeemat</h2><p>A price tracker.</p></a></main></body></html>', 'https://bruh.ae/projects')
  assert.match(markdown, /## \[Qeemat\]\(https:\/\/bruh.ae\/projects\/qeemat\)/)
  assert.match(markdown, /A price tracker\./)
  assert.doesNotMatch(markdown, /\[\s*\n/)
})

test('lifts author and article dates from JSON-LD into Markdown frontmatter', () => {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Quiet Death of SaaS Pricing Power',
    datePublished: '2026-07-16T09:00:00+04:00',
    dateModified: '2026-07-20T18:30:00+04:00',
    author: { '@type': 'Person', '@id': 'https://bruh.ae/#person', name: 'Adam Ahsan', url: 'https://bruh.ae/about' },
  }
  const markdown = htmlToMarkdown(pageHtml({
    title: 'The Quiet Death of SaaS Pricing Power',
    canonical: 'https://bruh.ae/writing/quiet-death-saas-pricing-power',
    jsonLd: article,
    main: '<h1>The Quiet Death of SaaS Pricing Power</h1><time datetime="2026-07-16">July 16, 2026</time>',
  }), 'https://bruh.ae/writing/quiet-death-saas-pricing-power')
  assert.match(markdown, /^---\n/)
  assert.match(markdown, /author: "Adam Ahsan"/)
  assert.match(markdown, /datePublished: "2026-07-16T09:00:00\+04:00"/)
  assert.match(markdown, /dateModified: "2026-07-20T18:30:00\+04:00"/)
  assert.match(markdown, /site: "bruh\.ae"/)
})

test('resolves a referenced article author and falls back to time[datetime] for the published date', () => {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': 'https://bruh.ae/#person', name: 'Adam Ahsan' },
      { '@type': 'Article', headline: 'An article', author: { '@id': 'https://bruh.ae/#person' } },
    ],
  }
  const markdown = htmlToMarkdown(pageHtml({
    title: 'An article',
    canonical: 'https://bruh.ae/writing/an-article',
    jsonLd: graph,
    main: '<h1>An article</h1><time datetime="2026-07-16T09:00:00+04:00">July 16, 2026</time>',
  }), 'https://bruh.ae/writing/an-article')
  assert.match(markdown, /author: "Adam Ahsan"/)
  assert.match(markdown, /datePublished: "2026-07-16T09:00:00\+04:00"/)
  assert.doesNotMatch(markdown, /dateModified:/)
})

test('lifts dateModified from a page node when there is no Article JSON-LD', () => {
  const markdown = htmlToMarkdown(pageHtml({
    title: 'About',
    canonical: 'https://bruh.ae/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: 'https://bruh.ae/about',
      name: 'About Adam Ahsan',
      dateModified: '2026-11-01',
      mainEntity: { '@id': 'https://bruh.ae/#person' },
    },
    main: '<h1>About Adam Ahsan</h1>',
  }), 'https://bruh.ae/about')
  assert.match(markdown, /dateModified: "2026-11-01"/)
  assert.doesNotMatch(markdown, /datePublished:/)
  assert.doesNotMatch(markdown, /^author:/m)
})

test('omits author and date frontmatter when the page has no structured data for them', () => {
  const markdown = htmlToMarkdown(pageHtml({
    title: 'Contact',
    canonical: 'https://bruh.ae/contact',
    main: '<h1>Contact</h1>',
  }), 'https://bruh.ae/contact')
  assert.match(markdown, /title: "Contact"/)
  assert.match(markdown, /url: "https:\/\/bruh\.ae\/contact"/)
  assert.match(markdown, /site: "bruh\.ae"/)
  assert.doesNotMatch(markdown, /^author:/m)
  assert.doesNotMatch(markdown, /^datePublished:/m)
  assert.doesNotMatch(markdown, /^dateModified:/m)
})

test('generates llms.txt, llms-full.txt, the full homepage graph, and clean routes for a Person+WebSite graph', async () => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-markdown-'))
  try {
    await mkdir(join(output, 'writing'), { recursive: true })
    await writeFile(join(output, 'index.html'), pageHtml({
      title: 'Adam Ahsan — Portfolio',
      description: "bruh.ae is Adam Ahsan's personal portfolio.",
      canonical: 'https://bruh.ae/',
      jsonLd: homepageGraph,
      main: '<h1>A slice of my life.</h1><p>Adam Ahsan</p>',
    }))
    await writeFile(join(output, 'about.html'), pageHtml({
      title: 'About Adam Ahsan',
      description: 'A short bio.',
      canonical: 'https://bruh.ae/about',
      main: '<h1>About Adam Ahsan</h1><p>A short bio.</p>',
    }))
    await writeFile(join(output, 'track-my-salah-privacy-policy.html'), pageHtml({
      title: 'Track My Salah Privacy Policy',
      description: 'How the app handles your data.',
      canonical: 'https://bruh.ae/track-my-salah-privacy-policy',
      main: '<h1>Privacy Policy</h1><p>Data details.</p>',
    }))
    await writeFile(join(output, 'writing', 'post.html'), pageHtml({
      title: 'A Post',
      description: 'A post description.',
      canonical: 'https://bruh.ae/writing/post',
      main: '<h1>A Post</h1><time datetime="2026-07-16">July 16, 2026</time>',
    }))
    await writeFile(join(output, '404.html'), '<h1>Not found</h1>')
    await writeFile(join(output, '_not-found.html'), '<h1>Not found</h1>')

    await generateMarkdown(output)

    assert.deepEqual(JSON.parse(await readFile(join(output, 'site-description.jsonld'), 'utf8')), homepageGraph)

    const llms = await readFile(join(output, 'llms.txt'), 'utf8')
    assert.match(llms, /^# Adam Ahsan\n/)
    assert.match(llms, /^> .*Adam Ahsan is a Dubai-based builder working on AI products and software\..*$/m)
    assert.match(llms, /bruh\.ae is Adam Ahsan's personal portfolio/)
    assert.match(llms, /^> .*Builder.*Dubai.*$/m)
    assert.match(llms, /^## Profiles\n\n- \[GitHub\]\(https:\/\/github\.com\/AdamJeddy\)/m)
    assert.match(llms, /- \[Substack\]\(https:\/\/uhwriter\.substack\.com\/\)/)
    assert.match(llms, /^## Pages\n/m)
    assert.match(llms, /- \[Adam Ahsan — Portfolio\]\(https:\/\/bruh\.ae\/_markdown\/index\.md\)/)
    assert.match(llms, /- \[About Adam Ahsan\]\(https:\/\/bruh\.ae\/_markdown\/about\.md\): A short bio\./)
    assert.match(llms, /- \[A Post\]\(https:\/\/bruh\.ae\/_markdown\/writing\/post\.md\): A post description\./)
    assert.match(llms, /^## Optional\n\n- \[Track My Salah Privacy Policy\]\(https:\/\/bruh\.ae\/_markdown\/track-my-salah-privacy-policy\.md\): How the app handles your data\./m)
    assert.match(llms, /^## About this file$/m)
    assert.doesNotMatch(llms, /_markdown\/404\.md|_not-found/)
    assert.doesNotMatch(llms.split('## Optional')[0], /track-my-salah-privacy-policy/, 'the privacy policy stays out of the primary Pages list')

    const llmsFull = await readFile(join(output, 'llms-full.txt'), 'utf8')
    assert.match(llmsFull, /^# Adam Ahsan\n\n## Adam Ahsan — Portfolio\n\nhttps:\/\/bruh\.ae\/\n\n/)
    assert.match(llmsFull, /## About Adam Ahsan\n\nhttps:\/\/bruh\.ae\/about\n\n/)
    assert.match(llmsFull, /## A Post\n\nhttps:\/\/bruh\.ae\/writing\/post\n\n/)
    assert.doesNotMatch(llmsFull, /Track My Salah Privacy Policy/, 'the noindex privacy page is excluded from llms-full.txt')
    assert.equal(llmsFull.split('\n\n---\n\n').length, 3)
    assert.equal((llmsFull.match(/^# /gm) || []).length, 1, 'llms-full.txt has exactly one top-level heading')
    assert.doesNotMatch(llmsFull, /^title: "/m, 'llms-full.txt does not repeat page frontmatter')

    const routes = JSON.parse(await readFile(join(output, '_routes.json'), 'utf8'))
    assert.deepEqual(routes.include, ['/', '/about', '/track-my-salah-privacy-policy', '/writing/post'])
    assert.deepEqual(routes.exclude, [])
    assert.ok(routes.include.every(route => route === '/' || (!route.endsWith('/') && !route.endsWith('.html'))))

    const article = await readFile(join(output, '_markdown', 'writing', 'post.md'), 'utf8')
    assert.match(article, /datePublished: "2026-07-16"/)
    assert.match(article, /site: "bruh\.ae"/)
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})

test('separates adjacent inline links so Markdown does not concatenate them', () => {
  const markdown = htmlToMarkdown(pageHtml({
    title: 'Links',
    canonical: 'https://bruh.ae/links',
    main: '<main><p><a href="/one">One</a><a href="/two">Two</a></p></main>'.replace('<main>', '').replace('</main>', ''),
  }), 'https://bruh.ae/links')
  assert.match(markdown, /\[One\]\(https:\/\/bruh\.ae\/one\) \[Two\]\(https:\/\/bruh\.ae\/two\)/)
})

test('marks negotiated Markdown private and states the content signal', async () => {
  const worker = createMarkdownWorker(pages)
  const markdown = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/markdown' } }), { ASSETS: assets() })
  assert.equal(markdown.headers.get('Content-Signal'), 'search=yes, ai-train=no, use=reference')
  assert.equal(markdown.headers.get('Cache-Control'), 'private, max-age=0, must-revalidate')
  assert.equal(markdown.headers.get('Content-Location'), 'https://bruh.ae/_markdown/about.md')
  const html = await worker.fetch(new Request('https://bruh.ae/about', { headers: { Accept: 'text/html' } }), { ASSETS: assets() })
  assert.equal(html.headers.get('Content-Signal'), 'search=yes, ai-train=no, use=reference')
  assert.equal(html.headers.get('Cache-Control'), null, 'HTML keeps the asset cache policy')
})

test('falls back to site metadata and warns when the homepage has no Person node', async (t) => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-markdown-'))
  const warning = t.mock.method(console, 'warn')
  try {
    const website = { '@context': 'https://schema.org', '@type': 'WebSite', url: 'https://bruh.ae', name: 'Adam’s Portfolio', description: 'Projects, commentary, and experiments.' }
    await writeFile(join(output, 'index.html'), pageHtml({
      title: 'Adam’s Portfolio',
      canonical: 'https://bruh.ae/',
      jsonLd: website,
      main: '<h1>Hello</h1>',
    }))
    await writeFile(join(output, 'about.html'), pageHtml({
      title: 'About',
      canonical: 'https://bruh.ae/about',
      main: '<h1>About</h1>',
    }))

    await generateMarkdown(output)

    assert.ok(warning.mock.calls.some(call => String(call.arguments[0]).includes('Person')), 'warns about the missing Person node')
    assert.deepEqual(JSON.parse(await readFile(join(output, 'site-description.jsonld'), 'utf8')), website)
    const llms = await readFile(join(output, 'llms.txt'), 'utf8')
    assert.match(llms, /^# Adam’s Portfolio\n/)
    assert.match(llms, /^> Projects, commentary, and experiments\.$/m)
    assert.match(llms, /## Pages/)
  } finally {
    t.mock.restoreAll()
    await rm(output, { recursive: true, force: true })
  }
})

test('buildRoutes keeps only clean page routes and enforces the Cloudflare rule guard', () => {
  const routes = buildRoutes(['/', '/about', '/writing/post', '/about'])
  assert.deepEqual(routes, { version: 1, include: ['/', '/about', '/writing/post'], exclude: [] })
  assert.ok(routes.include.every(route => route === '/' || (!route.endsWith('/') && !route.endsWith('.html'))))
  const atLimit = Array.from({ length: MAX_ROUTE_RULES - 1 }, (_, index) => `/page-${index}`)
  assert.equal(buildRoutes(atLimit).include.length, MAX_ROUTE_RULES)
  const tooMany = Array.from({ length: MAX_ROUTE_RULES }, (_, index) => `/page-${index}`)
  assert.throws(() => buildRoutes(tooMany), /_routes\.json would contain 91 include rules/)
})

test('builds Markdown and a deployable worker for exported routes, excluding error pages', async () => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-markdown-'))
  try {
    const html = '<html><head><title>Portfolio</title><link rel="canonical" href="https://bruh.ae/"></head><body><main><h1>Adam</h1><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","url":"https://bruh.ae"}</script></main></body></html>'
    await writeFile(join(output, 'index.html'), html)
    await writeFile(join(output, 'about.html'), html.replace('https://bruh.ae/', 'https://bruh.ae/about'))
    await writeFile(join(output, '404.html'), '<h1>Not found</h1>')
    await writeFile(join(output, '_not-found.html'), '<h1>Not found</h1>')
    await generateMarkdown(output)
    const description = JSON.parse(await readFile(join(output, 'site-description.jsonld'), 'utf8'))
    assert.equal(description['@type'], 'WebSite')
    assert.equal(description.url, 'https://bruh.ae')
    const routes = JSON.parse(await readFile(join(output, '_routes.json'), 'utf8'))
    assert.deepEqual(routes.include, ['/', '/about'])
    assert.ok(routes.include.every(route => route === '/' || (!route.endsWith('/') && !route.endsWith('.html'))))
    assert.match(await readFile(join(output, 'llms.txt'), 'utf8'), /^# Portfolio\n/)
    assert.match(await readFile(join(output, '_markdown/index.md'), 'utf8'), /# Adam/)
    const source = await readFile(join(output, '_worker.js'), 'utf8')
    const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
    const response = await worker.fetch(new Request('https://bruh.ae/about.html', { headers: { Accept: 'text/markdown' } }), {
      ASSETS: { fetch: async request => new Response(await readFile(join(output, new URL(request.url).pathname), 'utf8')) },
    })
    assert.match(response.headers.get('Content-Type'), /text\/markdown/)
    assert.match(response.headers.get('Link'), /rel="alternate"; type="text\/markdown"/)
    assert.match(await response.text(), /# Adam/)
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})
