import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

test('frames the homepage as Adam’s broader body of work', async () => {
  const page = await readFile(new URL('../src/app/page.tsx', import.meta.url), 'utf8')

  assert.match(page, /className="signal-hero-title"/)
  assert.match(page, /<span>A slice of my life\.<\/span>/)
  assert.match(page, /Pieces of my life/)
  assert.match(page, /in public\./)
})
