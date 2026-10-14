'use client'

import { useEffect } from 'react'
import { getHeroProgress, getRevealProgress } from '@/lib/signal-motion'

export default function SignalMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.signal-page')
    const hero = page?.querySelector<HTMLElement>('.signal-hero')
    if (!page || !hero) return
    const visuals = Array.from(page.querySelectorAll<HTMLElement>('.signal-project-visual'))
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const compact = matchMedia('(max-width: 768px)')
    let frame = 0

    const update = () => {
      frame = 0
      const heroBox = hero.getBoundingClientRect()
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const heroProgress = motion.matches ? 0 : getHeroProgress(heroBox.top - headerHeight, heroBox.height)
      hero.style.setProperty('--hero-shift', `${-heroProgress * 16}px`)
      hero.style.setProperty('--hero-scale', String(1 - heroProgress * 0.02))
      visuals.forEach(visual => {
        const progress = motion.matches ? 1 : getRevealProgress(visual.getBoundingClientRect().top, innerHeight)
        visual.style.setProperty('--reveal-shift', `${(1 - progress) * (compact.matches ? 12 : 24)}px`)
        visual.style.setProperty('--reveal-scale', String(0.985 + progress * 0.015))
      })
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(queue)
    observer.observe(page)
    addEventListener('scroll', queue, { passive: true })
    addEventListener('resize', queue)
    motion.addEventListener('change', queue)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      removeEventListener('scroll', queue)
      removeEventListener('resize', queue)
      motion.removeEventListener('change', queue)
    }
  }, [])
  return null
}
