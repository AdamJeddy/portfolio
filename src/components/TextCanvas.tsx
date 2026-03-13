'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type Zone = 'upper' | 'center' | 'lower'

export interface CanvasHighlight {
  text: string
  href?: string
  zone?: Zone
  glitch?: boolean
}

interface TextCanvasProps {
  words: string[]
  highlights: CanvasHighlight[]
}

type LineSegment =
  | { type: 'plain'; text: string }
  | { type: 'highlight'; highlight: CanvasHighlight }

interface LineRender {
  id: number
  segments: LineSegment[]
}

interface Placement {
  lineIndex: number
  startColumn: number
}

const extendedFactor = 1.5

function buildFiller(targetChars: number, words: string[]) {
  let content = ''
  while (content.length < targetChars + 32) {
    const word = words[Math.floor(Math.random() * words.length)]
    content += (content ? ' ' : '') + word
  }
  return content
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function TextCanvas({ words, highlights }: TextCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<LineRender[]>([])
  const [transitioning, setTransitioning] = useState(false)

  const seed = useMemo(
    () => highlights.map(() => ({ horizontal: Math.random(), vertical: Math.random() })),
    [highlights],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const render = () => {
      const style = getComputedStyle(container)
      const fontSize = parseFloat(style.fontSize)
      const lineHeight = parseFloat(style.lineHeight)
      const charWidth = fontSize * 0.55
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const charsPerViewport = Math.ceil(viewportWidth / charWidth)
      const extendedChars = Math.ceil(charsPerViewport * extendedFactor)
      const lineCount = Math.max(10, Math.floor(viewportHeight / lineHeight))

      const placements: Placement[] = highlights.map((highlight, index) => {
        const zone = highlight.zone ?? 'center'
        const zoneRange =
          zone === 'upper'
            ? { min: 0, max: Math.max(1, Math.floor(lineCount * 0.3)) }
            : zone === 'lower'
              ? { min: Math.max(0, Math.floor(lineCount * 0.7)), max: lineCount - 1 }
              : {
                  min: Math.max(0, Math.floor(lineCount * 0.4)),
                  max: Math.max(1, Math.floor(lineCount * 0.6)),
                }

        const preferredLine = Math.floor(
          zoneRange.min + (zoneRange.max - zoneRange.min) * seed[index].vertical,
        )

        const maxStartColumn = Math.max(0, extendedChars - highlight.text.length)
        const preferredStart = Math.floor(maxStartColumn * seed[index].horizontal)

        return {
          lineIndex: clamp(preferredLine, zoneRange.min, zoneRange.max),
          startColumn: clamp(preferredStart, 0, maxStartColumn),
        }
      })

      const lineHighlights = new Map<number, Array<{ start: number; highlight: CanvasHighlight }>>()
      placements.forEach((placement, index) => {
        const entry = lineHighlights.get(placement.lineIndex) ?? []
        entry.push({ start: placement.startColumn, highlight: highlights[index] })
        lineHighlights.set(placement.lineIndex, entry)
      })

      const nextLines: LineRender[] = []

      for (let i = 0; i < lineCount; i++) {
        const filler = buildFiller(extendedChars, words)
        const rowHighlights = [...(lineHighlights.get(i) ?? [])].sort((a, b) => a.start - b.start)

        if (rowHighlights.length === 0) {
          nextLines.push({
            id: i,
            segments: [{ type: 'plain', text: filler }],
          })
          continue
        }

        const segments: LineSegment[] = []
        let cursor = 0

        rowHighlights.forEach(({ start, highlight }) => {
          const safeStart = clamp(start, cursor, Math.max(cursor, filler.length - highlight.text.length))
          if (safeStart > cursor) {
            segments.push({ type: 'plain', text: filler.slice(cursor, safeStart) })
          }
          segments.push({ type: 'highlight', highlight })
          cursor = safeStart + highlight.text.length
        })

        if (cursor < filler.length) {
          segments.push({ type: 'plain', text: filler.slice(cursor) })
        }

        nextLines.push({ id: i, segments })
      }

      setLines(nextLines)
    }

    render()
    setTransitioning(true)
    const transitionTimer = setTimeout(() => setTransitioning(false), 220)

    let resizeFrame = 0
    const onResize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(render)
    }

    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(transitionTimer)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(resizeFrame)
    }
  }, [highlights, seed, words])

  return (
    <div
      ref={containerRef}
      className={`text-canvas ${transitioning ? 'text-canvas-transition' : ''}`}
      aria-label="Text flood interface"
    >
      {lines.map((line) => (
        <div key={line.id} className="text-canvas-line">
          {line.segments.map((segment, segmentIndex) => {
            if (segment.type === 'plain') {
              return (
                <span key={`${line.id}-${segmentIndex}`} className="text-canvas-dim">
                  {segment.text}
                </span>
              )
            }

            const className = segment.highlight.glitch
              ? 'text-canvas-highlight glitch'
              : 'text-canvas-highlight'

            if (segment.highlight.href) {
              return (
                <Link
                  key={`${line.id}-${segmentIndex}`}
                  href={segment.highlight.href}
                  className={className}
                >
                  {segment.highlight.text}
                </Link>
              )
            }

            return (
              <span key={`${line.id}-${segmentIndex}`} className={className}>
                {segment.highlight.text}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}