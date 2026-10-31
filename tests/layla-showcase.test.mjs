import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const showcasePath = new URL('../src/components/projects/LaylaShowcase.tsx', import.meta.url)
const experiencePath = new URL('../src/components/projects/LaylaExperience.tsx', import.meta.url)
const showcaseDataPath = new URL('../src/lib/layla-showcase.ts', import.meta.url)
const showcaseStylesPath = new URL('../src/components/projects/LaylaShowcase.module.css', import.meta.url)

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

test('Layla integrates the Beauty Passport inside one hero scene', async () => {
  const [source, data] = await Promise.all([
    readFile(showcasePath, 'utf8'),
    readFile(showcaseDataPath, 'utf8'),
  ])
  const heroStart = source.indexOf('<figure className={styles.heroVisual}>')
  const heroMarkup = source.slice(heroStart, source.indexOf('</figure>', heroStart))

  assert.match(heroMarkup, /laylaEditorialHero\.src/)
  assert.doesNotMatch(heroMarkup, /laylaPassportOverview\.src/)
  assert.doesNotMatch(heroMarkup, /heroProductScreen/)
  assert.match(source, /Layla is the FACES beauty coach\./)
  assert.match(data, /layla-editorial-hero-v2\.png/)
})

test('Layla gives the integrated hero image a full editorial panel', async () => {
  const styles = await readFile(showcaseStylesPath, 'utf8')

  assert.match(styles, /\.heroVisual\s*\{[^}]*align-self: stretch;[^}]*min-height: 700px;/s)
  assert.match(styles, /\.editorialHero\s*\{[^}]*position: absolute;[^}]*height: 100%;/s)
})

test('Layla gives Search and PDP entry points purpose-built visual surfaces', async () => {
  const [data, styles] = await Promise.all([
    readFile(showcaseDataPath, 'utf8'),
    readFile(showcaseStylesPath, 'utf8'),
  ])

  assert.match(data, /layla-search-entry-v2\.png/)
  assert.match(data, /layla-pdp-entry-v2\.png/)
  assert.match(styles, /\.entryPoint:nth-child\(-n \+ 2\) \.entryPointScreenshot img\s*\{[^}]*object-fit: cover;/s)
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
