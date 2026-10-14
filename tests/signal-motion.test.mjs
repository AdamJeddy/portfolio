import test from 'node:test'
import assert from 'node:assert/strict'
import { getHeroProgress, getRevealProgress } from '../src/lib/signal-motion.ts'

test('hero compression follows scroll and clamps outside its section', () => {
  assert.equal(getHeroProgress(100, 600), 0)
  assert.equal(getHeroProgress(-300, 600), 0.5)
  assert.equal(getHeroProgress(-900, 600), 1)
  assert.equal(getHeroProgress(0, 0), 0)
})

test('project is fully revealed before it reaches the top of the viewport', () => {
  assert.equal(getRevealProgress(1000, 800), 0)
  assert.equal(getRevealProgress(500, 800), 0.5)
  assert.equal(getRevealProgress(200, 800), 1)
  assert.equal(getRevealProgress(-100, 800), 1)
  assert.equal(getRevealProgress(0, 0), 1)
})

test('reversing scroll reverses the reveal continuously', () => {
  const down = [900, 700, 500, 300, 100].map(top => getRevealProgress(top, 800))
  assert.deepEqual([100, 300, 500, 700, 900].map(top => getRevealProgress(top, 800)), down.toReversed())
  assert.ok(Math.abs(getRevealProgress(500, 800) - getRevealProgress(499.9, 800)) < 0.001)
})

test('project motion starts and settles gently instead of changing at constant speed', () => {
  const entering = getRevealProgress(740, 800)
  const settling = getRevealProgress(260, 800)
  assert.ok(entering > 0 && entering < 0.05)
  assert.ok(settling > 0.95 && settling < 1)
  assert.ok(getRevealProgress(799, 800) < getRevealProgress(798, 800))
})
