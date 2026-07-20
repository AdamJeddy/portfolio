import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/about',
  title: 'About Adam — Projects, Commentary & Experiments',
  description: 'Meet Adam, a Dubai-based builder shaped by technology, creativity, and faith.',
})

const influences = [
  {
    title: 'Innovation',
    description:
      'I\'m interested in ideas that question how things currently work and what becomes possible when someone is willing to build an alternative.',
  },
  {
    title: 'Arts',
    description:
      'Films, books, other creative work influence how and what I work on.',
  },
  {
    title: 'Religion',
    description:
      'Islam is an important part of who I am and shapes how I think about purpose and the work I put into the world.',
  },
]

const approaches = [
  {
    title: 'Make ideas tangible',
    description:
      'I enjoy taking something abstract and working through it until it becomes real and useful.',
  },
  {
    title: 'Keep the creative instinct',
    description:
      'Good technology involves judgment, storytelling, taste, and attention to how something feels.',
  },
  {
    title: 'Build for people',
    description:
      'The most exciting part of technology is its reach, the possibility that something you create can genuinely serve and solve problems for people you may never meet.',
  },
]

function DossierRail({
  index,
  label,
  detail,
}: {
  index: string
  label: string
  detail: string
}) {
  return (
    <div className="about-rail" aria-hidden="true">
      <span>{label}</span>
      <span>{index}</span>
      <span>{detail}</span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="content-layer about-page">
      <Reveal type="slide-up">
        <section className="about-hero">
          <DossierRail index="01" label="About" detail="Personal dossier" />

          <div className="about-hero-copy">
            <h1>The person behind all of it.</h1>
            <p className="about-lead">
              I&apos;m Adam, based in Dubai. I build with technology, but the way I
              think has always been shaped by creativity.
            </p>
            {/* <p className="about-origin">
              My earliest experiences of working on a project came through media
              studies in school — scripting, recording, and editing short films with
              a team. Eventually I found my way into tech, but that creative
              instinct stayed with me just the medium changed.
            </p> */}
            <p>
              What excites me about tech is its ability to carry an idea far
              beyond the person who created it. A useful product can reach people at scale and have an impact that
              would otherwise feel impossible.
            </p>
          </div>

          <dl className="about-meta">
            <div>
              <dt>Location</dt>
              <dd>Dubai, UAE</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Technology × Creativity</dd>
            </div>
            <div>
              <dt>Mindset</dt>
              <dd>Build things that matter.</dd>
            </div>
          </dl>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="about-index-section">
          <DossierRail index="02" label="Influences" detail="Three forces" />
          <div className="about-influence-list">
            <h2 className="sr-only">Three influences</h2>
            {influences.map((influence, index) => (
              <article className="about-influence" key={influence.title}>
                <span className="about-item-index">0{index + 1}</span>
                <h3>{influence.title}</h3>
                <p>{influence.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal type="fade">
        <section className="about-index-section about-approach-section">
          <DossierRail index="03" label="Process" detail="How I approach things" />
          <div className="about-approach-list">
            <h2 className="sr-only">How I approach things</h2>
            {approaches.map((approach, index) => (
              <article className="about-approach" key={approach.title}>
                <span className="about-item-index">0{index + 1}</span>
                <h3>{approach.title}</h3>
                <p>{approach.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal type="fade">
        <section className="about-index-section about-final">
          <DossierRail index="04" label="Elsewhere" detail="What’s next" />
          <div className="about-final-content">
            <h2 className="sr-only">Elsewhere</h2>
            <p className="about-elsewhere">
              Away from building, I&apos;m usually moving between running, cycling, and
              swimming; watching films for inspiration; reading; doomscrolling and falling into a
              rabbit hole that occasionally manages to justify the doomscrolling.
            </p>
            <div className="about-cta">
              <h3>Let&apos;s build something useful.</h3>
              <span>
                I&apos;m always open to meaningful projects, thoughtful collaborations,
                and conversations that lead somewhere.
              </span>
              <div className="cta-row">
                <Link href="/contact" className="button">Get in touch</Link>
                <a
                  href="https://github.com/AdamJeddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button ghost"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
