import Reveal from '@/components/Reveal'

export default function ContactPage() {
  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
          <div className="col wfull">
            <p className="mega">Let&apos;s work together.</p>
            <p style={{
              fontFamily: 'var(--font-geist-sans), var(--font-sans)',
              fontSize: 'calc(var(--font-size) * 1.25)',
              lineHeight: 'calc(var(--line-px) * 1.4)',
              letterSpacing: '-0.01em',
              opacity: 0.6,
              marginTop: 'calc(var(--line-px) * 1.5)',
            }}>
              Have a project in mind or just want to say hello?
              I&apos;m always open to interesting conversations.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
          {/* Email Card */}
          <div className="col wfull">
            <div style={{
              border: '1px solid rgba(var(--white-rgb), 0.2)',
              borderRadius: 'var(--border-radius)',
              padding: 'calc(var(--line-px) * 2) var(--char2)',
              background: 'rgba(var(--white-rgb), 0.03)',
            }}>
              <p style={{
                fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                textTransform: 'uppercase',
                fontSize: 'calc(var(--font-size) * 0.85)',
                opacity: 0.5,
                marginBottom: 'calc(var(--char) * 1)',
              }}>
                Email
              </p>
              <a
                href="mailto:dev.ajx@proton.me"
                style={{
                  fontFamily: 'var(--font-geist-sans), var(--font-sans)',
                  fontSize: 'calc(var(--font-size) * 1.35)',
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  color: 'inherit',
                  wordBreak: 'break-all',
                }}
              >
                dev.ajx@proton.me
              </a>
            </div>
          </div>

          {/* Social Card */}
          <div className="col wfull">
            <div style={{
              border: '1px solid rgba(var(--white-rgb), 0.2)',
              borderRadius: 'var(--border-radius)',
              padding: 'calc(var(--line-px) * 2) var(--char2)',
              background: 'rgba(var(--white-rgb), 0.03)',
            }}>
              <p style={{
                fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                textTransform: 'uppercase',
                fontSize: 'calc(var(--font-size) * 0.85)',
                opacity: 0.5,
                marginBottom: 'calc(var(--char) * 1)',
              }}>
                Social
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--char) * 0.8)',
              }}>
                <a
                  href="https://github.com/AdamJeddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-geist-sans), var(--font-sans)',
                    fontSize: 'calc(var(--font-size) * 1.35)',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/adamahsan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-geist-sans), var(--font-sans)',
                    fontSize: 'calc(var(--font-size) * 1.35)',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
