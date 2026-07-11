import Reveal from '@/components/Reveal'

export default function ContactPage() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
        <div className="col w5">
          <p className="mega">Let&apos;s work together.</p>
        </div>
      </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section space">
        <div className="col w3">
          <h2>Email</h2>
          <p>
            <a href="mailto:adam@example.com">adam@example.com</a>
          </p>
        </div>
        <div className="col w3">
          <h2>Social</h2>
          <p>
            <a href="https://github.com/AdamJeddy" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
          <p>
            <a href="https://www.linkedin.com/in/adamahsan/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </section>
      </Reveal>
    </div>
  )
}
