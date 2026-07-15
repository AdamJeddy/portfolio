import Reveal from '@/components/Reveal'

export default function ContactPage() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section page-hero">
          <div className="col wfull">
            <p className="eyebrow">Contact</p>
            <h1 className="mega page-title">Let&apos;s make something useful.</h1>
            <p className="hero-copy">
              Have a project in mind, a problem worth solving, or simply want to
              compare notes on AI and product work? Email is the best place to start.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
          <div className="col wfull contact-primary">
            <p className="section-label">Email</p>
            <a className="contact-email" href="mailto:dev.ajx@proton.me">
              dev.ajx@proton.me
            </a>
            <p className="contact-note">The clearest way to reach me directly.</p>
          </div>
        </section>
      </Reveal>

      <Reveal type="fade">
        <section className="section section-final">
          <div className="col wfull">
            <p className="section-label">Elsewhere</p>
            <div className="contact-links">
              <a
                href="https://github.com/AdamJeddy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GitHub</span>
                <span>Code and projects ↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/adamahsan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LinkedIn</span>
                <span>Professional profile ↗</span>
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
