import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  path: '/about',
  title: 'About Adam — Projects, Commentary & Experiments',
  description: 'A little about Adam, the person behind the projects and commentary.',
})

export default function AboutPage() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section page-hero">
          <div className="col wfull">
            <p className="eyebrow">About</p>
            <h1 className="mega page-title">The person behind all of it.</h1>
            <p className="hero-copy">
              I&apos;m Adam, based in Dubai. I build things, follow ideas, and leave
              a few notes behind.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
          <div className="col wfull">
            <p className="section-label">A few things I care about</p>
            <ul className="about-list">
              <li>
                <span>01</span>
                <div>
                  <h2>AI with real-world standards</h2>
                  <p>
                    I care about craft, clarity, and whether a system actually works
                    in the hands of the people it is built for.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h2>Qeemat</h2>
                  <p>
                    A local-first Android price tracker for UAE shopping sites—no
                    accounts, cloud sync, or unnecessary complexity.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h2>Ideas worth sharing</h2>
                  <p>
                    Commentary gives me a place to follow an idea properly, whether
                    it starts with technology, products, culture, or something else.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal type="fade">
        <section className="section">
          <div className="col wfull">
            <p className="section-label">Principles</p>
            <p className="body-copy">
              I believe good software is legible software: code that tells a clear
              story, systems that fail gracefully, and interfaces that do not make
              people stop and think. I enjoy the detail work—turning a complicated
              problem into a focused product that feels obvious to use.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="fade">
        <section className="section section-final">
          <div className="col wfull">
            <p className="cta-title">Let&apos;s build something useful.</p>
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
        </section>
      </Reveal>
    </div>
  )
}
