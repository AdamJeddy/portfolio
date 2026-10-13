'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getPaperPose, getScrollProgress } from '@/lib/notebook-motion'

interface StoryEntry {
  title: string
  description: string
  href: string
  label: string
}

const sheets = ['layla', 'qeemat', 'notes']
const chapters = [
  { label: 'Build', progress: 1 / 3, fallback: '#selected-work' },
  { label: 'Explore', progress: 2 / 3, fallback: '#project-qeemat' },
  { label: 'Write', progress: 1, fallback: '#notebook-writing' },
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
    const papers = artwork.querySelectorAll<HTMLElement>('.notebook-paper')

    const update = () => {
      frame = 0
      const progress = motion.matches || compact.matches
        ? 0
        : getScrollProgress(window.scrollY, start, travel)
      const active = Math.min(3, Math.floor(progress * 3 + 0.4))
      setScene(active)
      papers.forEach((paper, index) => {
        const pose = getPaperPose(progress, index)
        paper.style.transform = `translate(${pose.x}%, ${pose.y}%) rotate(${pose.rotate}deg) rotateY(${pose.tilt}deg) scale(${pose.scale})`
        paper.style.zIndex = String(active === index + 1 ? 5 : 3 - index)
      })
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
            <div className="notebook-copy notebook-chapter" key={entry.href} aria-hidden={scene !== index + 1} inert={scene !== index + 1}>
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
