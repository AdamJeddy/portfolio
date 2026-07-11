'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavLink {
  href: string
  label: string
  className?: string
}

const primaryLinks: NavLink[] = [
  { href: '/projects', label: 'Work' },
  { href: '/writing', label: 'Writing' },
]

const secondaryLinks: NavLink[] = [
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <header data-component="header">
      <nav id="nav" className="hoverchar">
        {/* Column 1: Logo */}
        <div>
          <Link
            href="/"
            className={`home ${isActive('/') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
          >
            Adam
          </Link>
        </div>

        {/* Column 2: Primary links */}
        <div>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              rel="prefetch"
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 3: Secondary links */}
        <div className="secondary">
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              rel="prefetch"
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 4: Contact */}
        <div className="last">
          <Link
            href="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
          >
            Contact
          </Link>
        </div>

        {/* Mobile */}
        <div className="mobile">
          <Link
            href="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
          >
            Contact
          </Link>
          <button
            className="ghost"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="mobile-container">
          <Link href="/" className="home" onClick={closeMobile}>
            Adam
          </Link>
          {[...primaryLinks, ...secondaryLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-footer">
            <div className="newbusiness">
              <Link href="/contact" onClick={closeMobile}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
