import Link from 'next/link'
import { createPageMetadata } from '@/lib/metadata'
import '../studio-pages.css'

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
    <div className="studio-about-rail" aria-hidden="true">
      <span>{label}</span>
      <span>{index}</span>
      <span>{detail}</span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="studio-page studio-about-page">
      <section className="studio-about-hero" aria-labelledby="about-title">
        <DossierRail index="01" label="About" detail="Personal dossier" />

        <div className="studio-about-hero-copy">
          <h1 id="about-title">The person behind all of it.</h1>
          <p className="studio-about-lead">
            I&apos;m Adam, based in Dubai. I build with technology, but the way I
            think has always been shaped by creativity.
          </p>
          <p>
            What excites me about tech is its ability to carry an idea far
            beyond the person who created it. A useful product can reach people at scale and have an impact that
            would otherwise feel impossible.
          </p>
        </div>

        <dl className="studio-about-meta">
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

      <section className="studio-about-section" aria-labelledby="influences-title">
        <DossierRail index="02" label="Influences" detail="Three forces" />
        <div className="studio-about-influence-list">
          <h2 id="influences-title" className="sr-only">Three influences</h2>
          {influences.map((influence, index) => (
            <article className="studio-about-influence" key={influence.title}>
              <span className="studio-about-item-index">0{index + 1}</span>
              <h3>{influence.title}</h3>
              <p>{influence.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-about-section studio-about-approach-section" aria-labelledby="approach-title">
        <DossierRail index="03" label="Process" detail="How I approach things" />
        <div className="studio-about-approach-list">
          <h2 id="approach-title" className="sr-only">How I approach things</h2>
          {approaches.map((approach, index) => (
            <article className="studio-about-approach" key={approach.title}>
              <span className="studio-about-item-index">0{index + 1}</span>
              <h3>{approach.title}</h3>
              <p>{approach.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-about-section studio-about-final" aria-labelledby="elsewhere-title">
        <DossierRail index="04" label="Elsewhere" detail="What’s next" />
        <div className="studio-about-final-content">
          <h2 id="elsewhere-title" className="sr-only">Elsewhere</h2>
          <p className="studio-about-elsewhere">
            Away from building, I&apos;m usually moving between running, cycling, and
            swimming; watching films for inspiration; reading; doomscrolling and falling into a
            rabbit hole that occasionally manages to justify the doomscrolling.
          </p>
          <div className="studio-about-cta">
            <h3>Let&apos;s build something useful.</h3>
            <p>
              I&apos;m always open to meaningful projects, thoughtful collaborations,
              and conversations that lead somewhere.
            </p>
            <div className="studio-cta-row">
              <Link href="/contact" className="studio-page-action">Get in touch</Link>
              <a
                href="https://github.com/AdamJeddy"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-page-action"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
