'use client'

import Link from 'next/link'
import { useLiveClock } from '@/hooks/useLiveClock'

export default function Footer() {
  const clock = useLiveClock()

  return (
    <footer id="footer">
      <div className="shortcuts section between">
        <div className="col halfwidth">
          <Link href="/" className="logo" aria-label="Home">
            Adam
          </Link>
        </div>
        <div className="col halfwidth" style={{ alignItems: 'flex-end' }}>
          <span className="blink-fast loctime">GBG {clock}</span>
        </div>
      </div>

      <div className="section between" style={{ marginTop: 0 }}>
        <div className="col">
          <Link href="https://github.com/AdamJeddy" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </div>
        <div className="col">
          <Link href="https://www.linkedin.com/in/adamahsan/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  )
}
