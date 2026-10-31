import { createPageMetadata } from '@/lib/metadata'
import '../studio-pages.css'

export const metadata = createPageMetadata({
  path: '/contact',
  title: "Contact Adam",
  description: 'Get in touch with Adam about AI, product work, or useful things to build.',
})

export default function ContactPage() {
  return (
    <div className="studio-page studio-contact-page">
      <section className="studio-contact-hero" aria-labelledby="contact-title">
        <div>
          <p className="studio-page-label">Contact / Open to useful things</p>
          <h1 id="contact-title">Let&apos;s make something useful.</h1>
        </div>
        <div className="studio-contact-intro">
          <p>
            Have a project in mind, a problem worth solving, or simply want to
            compare notes on AI and product work? Email is the best place to start.
          </p>
          <a className="studio-contact-email" href="mailto:dev.ajx@proton.me">
            dev.ajx@proton.me <span aria-hidden="true">↗</span>
          </a>
          <p className="studio-contact-note">The clearest way to reach me directly.</p>
        </div>
      </section>

      <section className="studio-contact-elsewhere" aria-labelledby="elsewhere-title">
        <div className="studio-contact-elsewhere-heading">
          <p className="studio-page-label">Elsewhere</p>
          <h2 id="elsewhere-title">Keep in touch.</h2>
        </div>
        <ul className="studio-contact-links">
          <li>
            <a
              href="https://github.com/AdamJeddy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="studio-page-label">01</span>
              <span>GitHub</span>
              <span>Code and projects</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/adamahsan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="studio-page-label">02</span>
              <span>LinkedIn</span>
              <span>Professional profile</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
