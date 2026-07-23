'use client'

import Link from 'next/link'
import { useLiveClock } from '@/hooks/useLiveClock'

export default function Footer() {
  const clock = useLiveClock()

  return (
    <footer id="footer">
      <div className="footer-status">
        <div className="footer-identity">
          <p className="footer-label">Working from</p>
          <p className="footer-city">Dubai, UAE</p>
        </div>
        <div className="footer-time">
          <p className="footer-label">Adam&apos;s local time / DXB</p>
          <time>{clock || '--:--:--'}</time>
        </div>
      </div>

      <nav className="footer-links" aria-label="Social links">
        <Link href="https://github.com/AdamJeddy" target="_blank" rel="noopener noreferrer">
          <span className="footer-link-index" aria-hidden="true">01</span>
          <span className="footer-link-copy">
            <span>GitHub</span>
            <span>Contribute to my work</span>
          </span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        <Link href="https://www.linkedin.com/in/adamahsan/" target="_blank" rel="noopener noreferrer">
          <span className="footer-link-index" aria-hidden="true">02</span>
          <span className="footer-link-copy">
            <span>LinkedIn</span>
            <span>Connect with me</span>
          </span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
      </nav>
    </footer>
  )
}
