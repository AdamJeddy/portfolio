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

test('Layla puts an authentic FACES screen ahead of the case-study story', async () => {
  const [source, data] = await Promise.all([
    readFile(showcasePath, 'utf8'),
    readFile(showcaseDataPath, 'utf8'),
  ])

  assert.doesNotMatch(source, /laylaEditorialHero/)
  assert.match(source, /laylaPassportOverview\.src/)
  assert.match(source, /Layla is the FACES beauty coach\./)
  assert.match(source, /Authentic FACES screen/)
  assert.doesNotMatch(data, /layla-editorial-hero-v1\.png/)
})

test('Layla documents chat, Beauty Shelf, support, and reported impact with product evidence', async () => {
  const [experience, data] = await Promise.all([
    readFile(experiencePath, 'utf8'),
    readFile(showcaseDataPath, 'utf8'),
  ])

  assert.match(data, /layla-chat-entry\.jpg/)
  assert.match(data, /product-identification\.jpg/)
  assert.match(data, /layla-order-support-v1\.png/)
  assert.match(data, /2\.5×/)
  assert.match(experience, /iOS checkout/)
  assert.match(experience, /Illustrative support state/)
})
