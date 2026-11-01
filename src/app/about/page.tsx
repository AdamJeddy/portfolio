import Link from 'next/link'
import { createPageMetadata } from '@/lib/metadata'
import { createAboutPageGraph, serializeJsonLd } from '@/lib/schema'
import '../studio-pages.css'

export const metadata = createPageMetadata({
  path: '/about',
  title: 'About Adam Ahsan — Engineer & Product Thinker',
  absoluteTitle: true,
  description:
    'Meet Adam Ahsan, a Dubai-based engineer working where emerging technology meets product.',
})

const influences = [
  {
    title: 'Innovation',
    description:
      'New tools matter to me when they change what a product can do, not just how it looks. That usually starts by questioning a default and building the alternative.',
  },
  {
    title: 'Arts',
    description:
      'Film, books, and design train the eye for rhythm, framing, and restraint — details that decide whether software feels considered.',
  },
  {
    title: 'Religion',
    description:
      'Faith is a steady part of my life. It keeps purpose and integrity close to the work instead of treating them as a final polish.',
  },
]

const approaches = [
  {
    title: 'Make ideas tangible',
    description:
      'An idea earns my attention once it has to survive real constraints: a working build, a real user, a deadline that does not move.',
  },
  {
    title: 'Keep the creative instinct',
    description:
      'Engineering is only part of a good product. The rest is judgment — what to leave out, how it should feel, whether it is worth coming back to.',
  },
  {
    title: 'Build for people',
    description:
      'Software earns its place by removing friction for someone I may never meet. That reach is the part worth chasing.',
  },
]

const answers = [
  {
    question: 'Who is Adam Ahsan?',
    answer:
      'Adam Ahsan is an engineer and product thinker based in Dubai. He works where emerging technology meets real user needs — exploring what is newly possible and turning it into software people can use.',
  },
  {
    question: 'What is bruh.ae?',
    answer:
      'bruh.ae is Adam Ahsan\'s personal portfolio: selected work, commentary, and experiments.',
  },
  {
    question: 'What does Adam work on?',
    answer:
      'New technology and what it makes possible: evaluating emerging AI, shaping product direction, and building the backend and features that turn an idea into something people use.',
  },
  {
    question: 'Where is Adam based?',
    answer: 'Dubai, UAE.',
  },
  {
    question: 'How can I contact Adam?',
    answer:
      'Email dev.ajx@proton.me, or connect on LinkedIn.',
  },
]

const aboutJsonLd = serializeJsonLd(createAboutPageGraph())

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutJsonLd }} />
      <section className="studio-about-hero" aria-labelledby="about-title">
        <DossierRail index="01" label="About" detail="Personal dossier" />

        <div className="studio-about-hero-copy">
          <h1 id="about-title">
            Adam Ahsan{' '}
            <span className="studio-about-h1-role">The person behind all of it.</span>
          </h1>
          <p className="studio-about-lead">
            I like being early to new technology — exploring what it can do, then
            shaping it into products people actually use.
          </p>
          <p>
            Most of the work sits where product judgment meets engineering: AI
            features, conversational products, and local-first apps. This site is
            the running record — shipped projects, essays, and the experiments in
            between.
          </p>
        </div>

        <dl className="studio-about-meta">
          <div>
            <dt>Location</dt>
            <dd>Dubai, UAE</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>AI products × software</dd>
          </div>
          <div>
            <dt>Selected work</dt>
            <dd>Layla AI at FACES, Qeemat</dd>
          </div>
          <div>
            <dt>Mindset</dt>
            <dd>Build things that matter.</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd><a href="mailto:dev.ajx@proton.me">dev.ajx@proton.me</a></dd>
          </div>
          <div>
            <dt>Profiles</dt>
            <dd>
              <a href="https://github.com/AdamJeddy" target="_blank" rel="noopener noreferrer me">GitHub</a>
              {' · '}
              <a href="https://www.linkedin.com/in/adamahsan/" target="_blank" rel="noopener noreferrer me">LinkedIn</a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="studio-about-section" aria-labelledby="influences-title">
        <DossierRail index="02" label="Influences" detail="Three forces" />
        <div className="studio-about-influence-list">
          <h2 id="influences-title" className="sr-only">Three influences</h2>
          {influences.map((influence, index) => (
            <article className="studio-about-influence" key={influence.title}>
              <span className="studio-about-item-index" aria-hidden="true">0{index + 1}</span>
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
              <span className="studio-about-item-index" aria-hidden="true">0{index + 1}</span>
              <h3>{approach.title}</h3>
              <p>{approach.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-about-section studio-about-faq-section" aria-labelledby="answers-title">
        <DossierRail index="04" label="Answers" detail="Quick facts" />
        <div className="studio-about-faq">
          <h2 id="answers-title" className="sr-only">Quick answers about Adam Ahsan</h2>
          <dl>
            {answers.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="studio-about-section studio-about-final" aria-labelledby="elsewhere-title">
        <DossierRail index="05" label="Elsewhere" detail="What’s next" />
        <div className="studio-about-final-content">
          <h2 id="elsewhere-title" className="sr-only">Elsewhere</h2>
          <p className="studio-about-elsewhere">
            Away from a screen, I&apos;m usually running, cycling, or swimming;
            watching films for a change of perspective; reading; or falling down a
            rabbit hole that occasionally manages to justify the doomscrolling.
          </p>
          <div className="studio-about-cta">
            <h3>Let&apos;s make something useful.</h3>
            <p>
              I&apos;m open to projects, collaborations, and conversations that go
              somewhere.
            </p>
            <div className="studio-cta-row">
              <Link href="/contact" className="studio-page-action">Get in touch</Link>
              <a
                href="https://github.com/AdamJeddy"
                target="_blank"
                rel="noopener noreferrer me"
                className="studio-page-action"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/adamahsan/"
                target="_blank"
                rel="noopener noreferrer me"
                className="studio-page-action"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
