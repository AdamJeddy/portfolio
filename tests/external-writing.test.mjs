import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

const postsPath = new URL('../src/lib/posts.ts', import.meta.url)
const writingIndexPath = new URL('../src/app/writing/page.tsx', import.meta.url)
const writingPagePath = new URL('../src/app/writing/[slug]/page.tsx', import.meta.url)
const sitemapPath = new URL('../src/app/sitemap.ts', import.meta.url)

test('keeps the new government-power essay as a local article with links to both original publications', async () => {
  const posts = await readFile(postsPath, 'utf8')

  assert.match(posts, /How a Tech Company Accidentally Becomes Political/)
  assert.match(posts, /https:\/\/uhdam\.medium\.com\/how-a-tech-company-accidentally-becomes-political-9a2cffd10d9a\?sk=bb4b99f52d24167486589e3741cbc81b/)
  assert.match(posts, /https:\/\/uhwriter\.substack\.com\/p\/when-a-company-starts-acting-like/)
  assert.match(posts, /sourceLinks\?: PostSource\[\]/)
})

test('includes the essay in internal routes and exposes its publication links', async () => {
  const [writingIndex, writingPage, sitemap] = await Promise.all([
    readFile(writingIndexPath, 'utf8'),
    readFile(writingPagePath, 'utf8'),
    readFile(sitemapPath, 'utf8'),
  ])

  assert.match(writingIndex, /href=\{`\/writing\/\$\{post\.slug\}`\}/)
  assert.match(writingPage, /posts\.map\(\(post\) => \(\{ slug: post\.slug \}\)\)/)
  assert.match(writingPage, /post\.sourceLinks/)
  assert.match(sitemap, /posts\.map\(\(post\) => \(\{/)
})
