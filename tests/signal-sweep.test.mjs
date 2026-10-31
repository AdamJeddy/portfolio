import test from 'node:test'
import assert from 'node:assert/strict'
import { getSignalSweepTheme, shouldSignalSweep } from '../src/lib/signal-sweep.ts'

test('uses each project’s established colour for the outgoing sweep', () => {
  assert.deepEqual(getSignalSweepTheme('/projects/layla-ai'), {
    background: '#003b32',
    foreground: '#fff8ed',
  })
  assert.deepEqual(getSignalSweepTheme('/projects/qeemat'), {
    background: '#0047ff',
    foreground: '#ffffff',
  })
})

test('uses the Signal Studio palette for editorial destinations', () => {
  assert.deepEqual(getSignalSweepTheme('/writing'), {
    background: '#ddf46a',
    foreground: '#080907',
  })
  assert.deepEqual(getSignalSweepTheme('/contact'), {
    background: '#ddf46a',
    foreground: '#080907',
  })
})

test('sweeps only ordinary navigation to a different route', () => {
  assert.equal(shouldSignalSweep({ destinationPath: '/projects', currentPath: '/', hasModifier: false, target: '', download: false }), true)
  assert.equal(shouldSignalSweep({ destinationPath: '/', currentPath: '/', hasModifier: false, target: '', download: false }), false)
  assert.equal(shouldSignalSweep({ destinationPath: '/projects', currentPath: '/', hasModifier: true, target: '', download: false }), false)
  assert.equal(shouldSignalSweep({ destinationPath: '/projects', currentPath: '/', hasModifier: false, target: '_blank', download: false }), false)
  assert.equal(shouldSignalSweep({ destinationPath: '/projects', currentPath: '/', hasModifier: false, target: '', download: true }), false)
})
