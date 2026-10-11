import assert from 'node:assert/strict'
import test from 'node:test'
import { getScrollProgress, getPaperPose } from '../src/lib/notebook-motion.ts'

test('scroll progress stays within the story during overscroll', () => {
  assert.equal(getScrollProgress(-80, 100, 2000), 0)
  assert.equal(getScrollProgress(1100, 100, 2000), 0.5)
  assert.equal(getScrollProgress(2500, 100, 2000), 1)
})

test('a static or shorter-than-viewport story never divides by zero', () => {
  assert.equal(getScrollProgress(100, 0, 0), 0)
  assert.equal(getScrollProgress(100, 0, -300), 0)
})

test('paper movement is continuous and finite through every scene boundary', () => {
  for (const boundary of [1 / 3, 2 / 3]) {
    for (let sheet = 0; sheet < 3; sheet++) {
      const before = getPaperPose(boundary - 0.00001, sheet)
      const after = getPaperPose(boundary + 0.00001, sheet)
      for (const key of ['x', 'y', 'rotate', 'tilt', 'scale']) {
        assert.ok(Number.isFinite(before[key]))
        assert.ok(Math.abs(before[key] - after[key]) < 0.02, `${sheet}:${key} jumped`)
      }
    }
  }
})

test('each chapter actually moves the sheets and overscroll preserves end poses', () => {
  for (let sheet = 0; sheet < 3; sheet++) {
    assert.notDeepEqual(getPaperPose(0, sheet), getPaperPose(0.5, sheet))
    assert.deepEqual(getPaperPose(-1, sheet), getPaperPose(0, sheet))
    assert.deepEqual(getPaperPose(2, sheet), getPaperPose(1, sheet))
  }
})
