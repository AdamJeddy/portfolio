import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMarkdownWorker } from '../cloudflare/markdown-worker.mjs'
import { generateMarkdown, htmlToMarkdown } from '../scripts/generate-markdown.mjs'

const pages = { '/about': '/_markdown/about.md', '/about/': '/_markdown/about.md' }

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

test('builds Markdown and a deployable worker for exported routes, excluding error pages', async () => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-markdown-'))
  try {
    const html = '<html><head><title>Portfolio</title><link rel="canonical" href="https://bruh.ae/"></head><body><main><h1>Adam</h1></main></body></html>'
    await writeFile(join(output, 'index.html'), html)
    await writeFile(join(output, 'about.html'), html.replace('https://bruh.ae/', 'https://bruh.ae/about'))
    await writeFile(join(output, '404.html'), '<h1>Not found</h1>')
    await writeFile(join(output, '_not-found.html'), '<h1>Not found</h1>')
    await generateMarkdown(output)
    const routes = JSON.parse(await readFile(join(output, '_routes.json'), 'utf8'))
    assert.deepEqual(routes.include.sort(), ['/', '/index.html', '/about', '/about/', '/about.html'].sort())
    assert.match(await readFile(join(output, '_markdown/index.md'), 'utf8'), /# Adam/)
    const source = await readFile(join(output, '_worker.js'), 'utf8')
    const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
    const response = await worker.fetch(new Request('https://bruh.ae/about.html', { headers: { Accept: 'text/markdown' } }), {
      ASSETS: { fetch: async request => new Response(await readFile(join(output, new URL(request.url).pathname), 'utf8')) },
    })
    assert.match(response.headers.get('Content-Type'), /text\/markdown/)
    assert.match(await response.text(), /# Adam/)
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})
