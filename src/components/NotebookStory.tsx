'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { chapterProgress, getActiveScene, getCopyPose, getPaperPose, getScrollProgress, settleProgress } from '@/lib/notebook-motion'

interface StoryEntry {
  title: string
  description: string
  href: string
  label: string
}

const sheets = ['layla', 'qeemat', 'notes']
const chapters = [
  { label: 'Build', progress: chapterProgress[0], fallback: '#selected-work' },
  { label: 'Explore', progress: chapterProgress[1], fallback: '#project-qeemat' },
  { label: 'Write', progress: chapterProgress[2], fallback: '#notebook-writing' },
]

export default function NotebookStory({ entries }: { entries: StoryEntry[] }) {
  const storyRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const artworkRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState(0)

  useEffect(() => {
    const story = storyRef.current
    const stage = stageRef.current
    const artwork = artworkRef.current
    if (!story || !stage || !artwork) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia('(max-height: 600px)')
    let frame = 0
    let start = 0
    let travel = 0
    let rendered = 0
    let lastTime = 0
    let initialized = false
    const papers = artwork.querySelectorAll<HTMLElement>('.notebook-paper')
    const copies = stage.querySelectorAll<HTMLElement>('.notebook-copy')
    const chapterLinks = stage.querySelectorAll<HTMLElement>('.notebook-chapters > a:not(.notebook-scroll-cue)')

    const update = (time: number) => {
      frame = 0
      const disabled = motion.matches || compact.matches
      const target = disabled
        ? 0
        : getScrollProgress(window.scrollY, start, travel)
      rendered = !initialized || disabled ? target : settleProgress(rendered, target, lastTime ? time - lastTime : 16.67)
      initialized = true
      lastTime = time
      const active = getActiveScene(rendered)
      setScene(active)
      papers.forEach((paper, index) => {
        const pose = getPaperPose(rendered, index)
        paper.style.transform = `translate(${pose.x}%, ${pose.y}%) rotate(${pose.rotate}deg) rotateY(${pose.tilt}deg) scale(${pose.scale})`
        paper.style.opacity = String(pose.opacity)
      })
      copies.forEach((copy, index) => {
        const pose = getCopyPose(rendered, index)
        copy.style.opacity = String(pose.opacity)
        copy.style.transform = `translateY(${pose.y}px)`
        copy.style.visibility = pose.opacity > 0.001 ? 'visible' : 'hidden'
      })
      chapterLinks.forEach((link, index) => {
        const starts = [0.205, 0.515, 0.825]
        const end = starts[index + 1] ?? 1
        const fill = Math.min(1, Math.max(0, (rendered - starts[index]) / (end - starts[index])))
        link.style.setProperty('--chapter-fill', `${fill * 100}%`)
      })
      // Stop rendering once scroll settles; no perpetual animation loop.
      if (rendered !== target) frame = requestAnimationFrame(update)
      else lastTime = 0
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => {
      story.dataset.motion = String(!motion.matches && !compact.matches)
      start = story.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(stage).top) || 0)
      travel = story.offsetHeight - stage.offsetHeight
      queue()
    }
    // Observe element sizes as well as viewport changes (fonts, zoom, orientation).
    const resize = new ResizeObserver(measure)
    resize.observe(story)
    resize.observe(stage)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', measure)
    motion.addEventListener('change', measure)
    compact.addEventListener('change', measure)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', measure)
      motion.removeEventListener('change', measure)
      compact.removeEventListener('change', measure)
    }
  }, [])

  return (
    <section ref={storyRef} className="notebook-story" aria-label="An open notebook">
      <div ref={stageRef} className="notebook-stage" data-scene={scene}>
        <div className="notebook-copy-stack">
          <div className="notebook-copy notebook-intro" aria-hidden={scene !== 0} inert={scene !== 0}>
            <p className="notebook-eyebrow">Adam Ahsan / Dubai, UAE</p>
            <h1><span>A work</span><span><i>in </i>progress.</span></h1>
            <p className="notebook-deck">Building useful things.<br />Exploring what comes next.</p>
            <a className="notebook-link" href="#selected-work">
              Explore my work <Image src="/icons/arrow-up-right.svg" alt="" width={20} height={20} />
            </a>
          </div>
          {entries.map((entry, index) => (
            <div className="notebook-copy notebook-chapter" key={entry.href} aria-hidden={scene !== index + 1} inert={scene !== index + 1} style={{ opacity: 0, visibility: 'hidden' }}>
              <p className="notebook-eyebrow">{String(index + 1).padStart(2, '0')} / {entry.label}</p>
              <h2>{entry.title}</h2>
              <p className="notebook-chapter-description">{entry.description}</p>
              <Link className="notebook-link" href={entry.href}>
                {index === 2 ? 'Read the commentary' : 'View the project'}
                <Image src="/icons/arrow-up-right.svg" alt="" width={20} height={20} />
              </Link>
            </div>
          ))}
        </div>

        <div className="notebook-artwork" ref={artworkRef} aria-hidden="true">
          {sheets.map((sheet, index) => {
            const pose = getPaperPose(0, index)
            return (
              <div className={`notebook-paper notebook-paper-${sheet}`} key={sheet} style={{ transform: `translate(${pose.x}%, ${pose.y}%) rotate(${pose.rotate}deg) rotateY(${pose.tilt}deg) scale(${pose.scale})`, zIndex: 3 - index }}>
                <Image src={`/images/notebook/${sheet}-sheet.webp`} alt="" width={900} height={1350} sizes="(max-width: 768px) 72vw, 45vw" unoptimized priority draggable={false} />
              </div>
            )
          })}
        </div>

        <nav className="notebook-chapters" aria-label="Notebook chapters">
          {chapters.map((chapter, index) => (
            <a
              key={chapter.label}
              href={chapter.fallback}
              aria-current={(scene < 2 ? 0 : scene - 1) === index ? 'step' : undefined}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                const story = storyRef.current
                const stage = stageRef.current
                if (!story || !stage || window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 600px)').matches) return
                event.preventDefault()
                const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0
                const top = story.getBoundingClientRect().top + window.scrollY - header
                window.scrollTo({ top: top + chapter.progress * (story.offsetHeight - stage.offsetHeight), behavior: 'smooth' })
              }}
            >
              <span>{String(index + 1).padStart(2, '0')} <b>—</b> {chapter.label}</span>
            </a>
          ))}
          <a className="notebook-scroll-cue" href="#selected-work" aria-label="Skip to selected work">
            <span>Scroll to unfold</span><Image src="/icons/arrow-down.svg" alt="" width={24} height={24} />
          </a>
        </nav>
      </div>
    </section>
  )
}
