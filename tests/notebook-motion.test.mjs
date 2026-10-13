import assert from 'node:assert/strict'
import test from 'node:test'
import { getScrollProgress, getPaperPose, getCopyPose, getActiveScene, settleProgress } from '../src/lib/notebook-motion.ts'

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
  for (const boundary of [0.12, 0.30, 0.43, 0.61, 0.74, 0.92]) {
    for (let sheet = 0; sheet < 3; sheet++) {
      const before = getPaperPose(boundary - 0.00001, sheet)
      const after = getPaperPose(boundary + 0.00001, sheet)
      for (const key of ['x', 'y', 'rotate', 'tilt', 'scale', 'opacity']) {
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

test('each chapter holds its composition long enough to read', () => {
  for (const [start, end] of [[0, 0.12], [0.30, 0.43], [0.61, 0.74], [0.92, 1]]) {
    for (let sheet = 0; sheet < 3; sheet++) {
      assert.deepEqual(getPaperPose(start, sheet), getPaperPose(end, sheet))
    }
  }
})

test('chapter copy hands off without two readable titles overlapping', () => {
  for (let step = 0; step <= 1000; step++) {
    const progress = step / 1000
    const copies = [0, 1, 2, 3].map(scene => getCopyPose(progress, scene))
    assert.ok(copies.filter(copy => copy.opacity > 0.05).length <= 1)
    assert.ok(getActiveScene(progress) >= 0 && getActiveScene(progress) <= 3)
  }
  for (const [progress, scene] of [[0, 0], [0.36, 1], [0.67, 2], [0.96, 3]]) {
    assert.equal(getCopyPose(progress, scene).opacity, 1)
    assert.equal(getActiveScene(progress), scene)
  }
})

test('scroll smoothing is frame-rate independent and settles exactly', () => {
  let at60 = 0, at120 = 0
  for (let i = 0; i < 60; i++) at60 = settleProgress(at60, 1, 1000 / 60)
  for (let i = 0; i < 120; i++) at120 = settleProgress(at120, 1, 1000 / 120)
  assert.equal(at60, 1)
  assert.equal(at120, 1)
  assert.ok(settleProgress(0.5, 0.2, 16) < 0.5)
})
