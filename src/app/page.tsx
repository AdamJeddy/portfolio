"use client"

import { useEffect, useState } from "react"

// Array of random words used to build the texture
const randomWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "accusantium", "doloremque", "laudantium",
  "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore",
  "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo",
  "nemo", "voluptatem", "quia", "voluptas", "aspernatur", "odit", "aut", "fugit",
  "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt",
  "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam", "eius", "modi",
  "tempora", "magnam", "aliquam", "quaerat", "voluptatem", "harum", "quidem",
  "rerum", "facilis", "expedita", "distinctio", "nam", "libero", "tempore",
  "soluta", "nobis", "eligendi", "optio", "cumque", "nihil", "impedit", "quo",
  "minus", "maxime", "placeat", "facere", "possimus", "omnis", "assumenda",
]

type LayoutState = {
  lines: string[]
  centerIndex: number
  // Where the highlight starts (character index) inside the center line
  centerStart: number
  fontSize: number
  lineHeight: number
}

const HIGHLIGHT = " by Adam "

// Build a long filler string of words (with spaces) to at least target length
function buildFiller(targetChars: number): string {
  let s = ""
  while (s.length < targetChars + 16) {
    const w = randomWords[Math.floor(Math.random() * randomWords.length)]
    s += (s ? " " : "") + w
  }
  return s
}

export default function Home() {
  const [state, setState] = useState<LayoutState>({
    lines: [],
    centerIndex: 0,
    centerStart: 0,
    fontSize: 14,
    lineHeight: 20,
  })

  useEffect(() => {
    let raf = 0
  const compute = () => {
      const vw = Math.max(320, window.innerWidth)
      const vh = Math.max(320, window.innerHeight)

  // Pick a readable font-size that scales with viewport but stays mobile-friendly and a bit larger
  const fontSize = Math.round(Math.min(22, Math.max(14, vw / 45))) // ~14 on phones, up to 22 on desktop
  const lineHeight = Math.round(fontSize * 1.3)

      // Monospace character width is ~0.55 of font size for better fit
      const charWidth = fontSize * 0.55
  const charsPerLine = Math.ceil(vw / charWidth) * 1.5 // extend beyond screen edges by 50%

  // Overfill vertically by rounding up so no gap remains at the bottom; overflow is hidden
  const linesCount = Math.max(8, Math.ceil(vh / lineHeight))
      const centerIndex = Math.floor(linesCount / 2)
      // Center position should be based on viewport width, not the extended line width
      const viewportChars = Math.ceil(vw / charWidth)
      const centerStart = Math.max(0, Math.floor(((charsPerLine - viewportChars) / 9) + (viewportChars - HIGHLIGHT.length) / 2))

      const lines: string[] = []
      for (let i = 0; i < linesCount; i++) {
        const base = buildFiller(charsPerLine)
        if (i === centerIndex) {
          // Splice the highlight into the middle
          const left = base.slice(0, centerStart)
          const right = base.slice(centerStart + HIGHLIGHT.length)
          lines.push(left + HIGHLIGHT + right)
        } else {
          lines.push(base)
        }
      }

      setState({ lines, centerIndex, centerStart, fontSize, lineHeight })
    }

    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-black font-mono select-none relative"
      style={{ fontSize: state.fontSize, lineHeight: `${state.lineHeight}px` }}
    >
      {state.lines.map((line, i) => {
        if (i === state.centerIndex) {
          // Render the center line with a colored highlight without affecting layout
          const left = line.slice(0, state.centerStart)
          const right = line.slice(state.centerStart + HIGHLIGHT.length)
          return (
            <div key={i} className="whitespace-nowrap">
              <span className="text-gray-900 opacity-50">{left}</span>
              <span className="text-red-600 font-bold italic">{HIGHLIGHT}</span>
              <span className="text-gray-900 opacity-50">{right}</span>
            </div>
          )
        }
        return (
          <div key={i} className="whitespace-nowrap text-gray-900 opacity-50">
            {line}
          </div>
        )
      })}
    </main>
  )
}
