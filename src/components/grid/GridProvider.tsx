'use client'

import { useEffect } from 'react'

/**
 * Computes a monospace-character-grid measurement system and exposes
 * values as CSS custom properties on <html>.
 *
 * Adapted from the Aino Agency grid system:
 *   - --ch        Character width in px
 *   - --cols      Total character columns fitting the viewport
 *   - --col       Layout column count
 *   - --rows      Total character rows fitting the viewport
 *   - --line      Line height (2 × ch) — the base vertical rhythm unit
 *   - --font-size Base font size for the proportional text layer
 *   - --letter-spacing  Letter spacing for monospace text
 *   - --strip-1 through --strip-12  Column strip widths in character units
 *
 * Recalculates on window resize (desktop) or orientationchange (touch).
 */
export default function GridProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let frame = 0

    const compute = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const mobile = w < 769
      const ch = mobile ? 8 : 7.5

      // ── Character grid ──────────────────────────────────
      const cols = Math.round(w / ch)
      const lineHeight = Math.round(ch * 2)
      const fontSize = ch / 0.6 - 0.9
      const letterSpacing = 0.6 * (ch / 0.6 - fontSize)

      // ── Strip system (8-column layout) ──────────────────
      // On desktop we account for 18px of chrome (scrollbar, etc.)
      // then divide remaining space into 8 strips with gutters.
      let stripCount = 0
      let gutterCols = 0

      if (!mobile) {
        let adjustedWidth = w - 18
        adjustedWidth -= adjustedWidth % 16
        const recalcCh = adjustedWidth / (Math.round(adjustedWidth / ch) + 18)
        gutterCols = Math.ceil((Math.round(w / recalcCh) - 18) / 8)
        stripCount = 2 * gutterCols + 2
      } else {
        const mobileCh = w / Math.round(w / ch)
        gutterCols = Math.ceil((Math.round(w / mobileCh) - 5) / 2)
        stripCount = gutterCols * 2 + 1
      }

      // Extra strips (9–12) for wider layouts
      const extraStrips = 12

      const strips: Record<string, string> = {}
      for (let i = 0; i < extraStrips; i++) {
        strips[`--strip-${i + 1}`] = String(gutterCols + i * (gutterCols + 2))
      }

      // ── Safari adjustment ───────────────────────────────
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

      // ── Apply to <html> ─────────────────────────────────
      const style: Record<string, string> = {
        '--ch': String(Math.round(ch * 10) / 10),
        '--cols': String(cols),
        '--col': String(stripCount),
        '--rows': String(Math.floor(h / (2 * ch))),
        '--font-size': `${Math.round(fontSize * 10) / 10}px`,
        '--line': `${lineHeight}px`,
        '--line-height': isSafari ? `${Math.round(2 * ch)}px` : `${lineHeight}px`,
        '--letter-spacing': `${Math.round(letterSpacing * 100) / 100}px`,
        '--screen-height': `${screen.availHeight}`,
        ...strips,
      }

      Object.entries(style).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v)
      })
    }

    compute()
    window.scrollTo(0, 0)

    const eventType = 'ontouchstart' in window ? 'orientationchange' : 'resize'
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(compute)
    }
    window.addEventListener(eventType, onResize)
    return () => {
      window.removeEventListener(eventType, onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <>{children}</>
}
