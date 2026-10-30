import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const showcasePath = new URL('../src/components/projects/LaylaShowcase.tsx', import.meta.url)
const experiencePath = new URL('../src/components/projects/LaylaExperience.tsx', import.meta.url)
const showcaseDataPath = new URL('../src/lib/layla-showcase.ts', import.meta.url)

test('Layla tells the product story in the shopper journey order', async () => {
  const [showcaseSource, experienceSource] = await Promise.all([
    readFile(showcasePath, 'utf8'),
    readFile(experiencePath, 'utf8'),
  ])
  const journeySections = [
    'id="entry-points"',
    'id="beauty-passport"',
    'id="shop-with-layla"',
    'id="after-purchase"',
  ]

  const positions = journeySections.map(section => experienceSource.indexOf(section))

  assert.ok(positions.every(position => position >= 0))
  assert.deepEqual([...positions].sort((first, second) => first - second), positions)
  assert.ok(showcaseSource.indexOf('<LaylaExperience />') < showcaseSource.indexOf('id="my-role"'))
})

test('Layla pairs an editorial hero asset with authentic product evidence', async () => {
  const [source, data] = await Promise.all([
    readFile(showcasePath, 'utf8'),
    readFile(showcaseDataPath, 'utf8'),
  ])

  assert.match(source, /laylaEditorialHero/)
  assert.match(data, /layla-editorial-hero-v1\.png/)
  assert.match(source, /laylaPassportOverview\.src/)
})
