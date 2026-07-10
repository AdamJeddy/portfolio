'use client'

import { useEffect, useRef, useState } from 'react'

type RevealType = 'fade' | 'slide-up'

interface UseRevealOptions {
  type?: RevealType
  delay?: number // ms delay per child for stagger
  threshold?: number
  rootMargin?: string
}

/**
 * IntersectionObserver-based scroll reveal.
 * Attach the returned ref to a container; children get revealed as they enter the viewport.
 */
export function useReveal({
  type = 'fade',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
}: UseRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If no JS or already revealed, skip
    if (revealed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)

          // Stagger children
          const children = el.querySelectorAll<HTMLElement>('[data-reveal-child]')
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * delay}ms`
            child.classList.add('revealed')
          })

          observer.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [revealed, delay, threshold, rootMargin])

  return { ref, revealed, 'data-reveal': type, 'data-init': true } as const
}
