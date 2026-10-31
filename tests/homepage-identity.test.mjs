import { readFile } from 'node:fs/promises'
import test from 'node:test'
import assert from 'node:assert/strict'

test('frames the homepage as Adam’s broader body of work', async () => {
  const page = await readFile(new URL('../src/app/page.tsx', import.meta.url), 'utf8')

  assert.match(page, /A slice of/)
  assert.match(page, /my life\./)
  assert.match(page, /Projects, words, experiments/)
  assert.match(page, /whatever I&apos;m learning in public\./)
})
