import Reveal from '@/components/Reveal'

export default function ThePerson() {
  const skills = [
    'TypeScript', 'Python', 'React', 'Next.js', 'Node.js',
    'PostgreSQL', 'SQLite', 'Cloudflare', 'Docker', 'FastAPI',
    'LangChain', 'Vector DB', 'Kafka', 'Tailwind', 'System Design',
    'Data Engineering', 'AI/ML', 'API Design',
  ]

  return (
    <div className="content-layer">
      <Reveal type="slide-up">
        <section className="section first">
        <div className="col wfull" style={{ flexDirection: 'row', gap: 'var(--char2)', alignItems: 'flex-start' }}>
          <div className="col w2">
            <div className="profile-image">
              <span>⬡</span>
            </div>
          </div>
          <div className="col wfull">
            <p className="mega">
              Adam — Software Engineer. AI + Data.
            </p>
            <p style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginTop: 'var(--line-px)',
              opacity: 0.5,
            }}>
              Dubai, UAE · AI Lead at Chalhoub Group
            </p>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
        <div className="col wfull">
          <p style={{
            fontFamily: 'var(--font-geist-sans), var(--font-sans)',
            fontSize: 'calc(var(--font-size) * 1.25)',
            lineHeight: 'calc(var(--line-px) * 1.4)',
            letterSpacing: '-0.01em',
          }}>
            I build tools that solve real problems — currently leading AI
            initiatives at Chalhoub Group, the largest luxury retail operator
            in the Middle East. I care about craft, clarity, and whether
            something actually works in the hands of real people.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="col wfull">
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)' }}>
            My side project Qeemat — an Android price tracker for UAE shopping
            sites — reflects how I think about software: local-first, no
            accounts, no cloud. Just a focused tool that does one thing well.
            Built with React Native, TypeScript, and Kotlin, it tracks prices
            across Noon, Nike, Ounass, and more with background checks and
            local notifications.
          </p>
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)', marginTop: 'var(--line-px)' }}>
            I write occasionally about the intersection of AI, luxury, and
            creative production — most recently exploring how brands quietly
            adopt AI-generated content while the internet debates authenticity.
            The throughline in everything I do is the same: taste and standards
            matter more than tools.
          </p>
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)', marginTop: 'var(--line-px)' }}>
            I believe good software is legible software — code that tells a
            clear story, systems that fail gracefully, and interfaces that
            don&apos;t make you think. When I&apos;m not building, I&apos;m
            reading about how luxury brands think about craft, or iterating
            on whatever side project has my attention that week.
          </p>
        </div>
      </section>
      </Reveal>

      {/* Skills */}
      <Reveal type="slide-up">
        <section className="section space">
        <div className="col wfull">
          <h2 style={{
            fontFamily: 'var(--font-geist-mono), var(--font-mono)',
            textTransform: 'uppercase',
            marginBottom: 'var(--line-px)',
          }}>
            Skills & Technologies
          </h2>
          <div style={{ display: 'flex', gap: 'var(--char)', flexWrap: 'wrap' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily: 'var(--font-geist-mono), var(--font-mono)',
                  background: 'rgba(var(--white-rgb), 0.08)',
                  padding: 'calc(var(--char) * 0.5) calc(var(--char) * 1)',
                  borderRadius: 'var(--border-radius)',
                  textTransform: 'uppercase',
                  fontSize: 'calc(var(--font-size) * 0.85)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Contact CTA */}
      <Reveal type="slide-up">
        <section className="section space">
        <div className="col wfull">
          <p className="mega" style={{ fontSize: 'calc(var(--font-size) * 1.8)' }}>
            Let&apos;s build something.
          </p>
          <div style={{ display: 'flex', gap: 'var(--char)', marginTop: 'var(--line-px)' }}>
            <a href="/contact" className="button">
              Get in touch
            </a>
            <a
              href="https://github.com/AdamJeddy"
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
      </Reveal>
    </div>
  )
}
