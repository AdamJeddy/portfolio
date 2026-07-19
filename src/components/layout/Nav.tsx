'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface NavLink {
  href: string
  label: string
}

const primaryLinks: NavLink[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Commentary' },
]

const secondaryLinks: NavLink[] = [
  { href: '/about', label: 'About' },
]

const mobileLinks: NavLink[] = [
  ...primaryLinks,
  ...secondaryLinks,
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    if (!mobileOpen) return

    const backgroundContent = [
      document.getElementById('app'),
      document.getElementById('footer'),
    ].filter((element): element is HTMLElement => element !== null)
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    backgroundContent.forEach((element) => element.setAttribute('inert', ''))
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileOpen(false)
        requestAnimationFrame(() => mobileToggleRef.current?.focus())
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = [
        mobileToggleRef.current,
        ...Array.from(mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []),
      ].filter((element): element is HTMLButtonElement | HTMLAnchorElement => element !== null)
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLButtonElement | HTMLAnchorElement,
      )

      if (currentIndex === -1) return

      if (!event.shiftKey && currentIndex === focusableElements.length - 1) {
        event.preventDefault()
        focusableElements[0]?.focus()
      }

      if (event.shiftKey && currentIndex === 0) {
        event.preventDefault()
        focusableElements[focusableElements.length - 1]?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      backgroundContent.forEach((element) => element.removeAttribute('inert'))
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <header data-component="header" data-menu-open={mobileOpen || undefined}>
      <nav id="nav" className="hoverchar">
        <div>
          <Link
            href="/"
            className={`home ${isActive('/') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Adam
          </Link>
        </div>

        <div>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              rel="prefetch"
              onClick={closeMobile}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="secondary">
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              rel="prefetch"
              onClick={closeMobile}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="last">
          <Link
            href="/contact"
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
            aria-current={isActive('/contact') ? 'page' : undefined}
          >
            Contact
          </Link>
        </div>

        <div className="mobile">
          <Link
            href="/"
            className={`home ${isActive('/') ? 'active' : ''}`}
            rel="prefetch"
            onClick={closeMobile}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Adam
          </Link>
          <button
            ref={mobileToggleRef}
            type="button"
            className="ghost mobile-menu-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="mobile-container"
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal="true"
        >
          <nav aria-label="Main navigation">
            {mobileLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'active' : ''}
                onClick={closeMobile}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                <span className="mobile-menu-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
