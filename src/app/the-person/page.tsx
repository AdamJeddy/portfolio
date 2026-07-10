export default function ThePerson() {
  const skills = [
    'TypeScript', 'Python', 'React', 'Next.js', 'Node.js',
    'PostgreSQL', 'SQLite', 'Cloudflare', 'Docker', 'FastAPI',
    'LangChain', 'Vector DB', 'Kafka', 'Tailwind', 'System Design',
    'Data Engineering', 'AI/ML', 'API Design',
  ]

  return (
    <div className="content-layer">
      <section className="section first">
        <div className="col w5">
          <p className="mega">
            Adam — Software Engineer. AI + Data.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="col w4">
          <p style={{
            fontFamily: 'var(--font-geist-sans), var(--font-sans)',
            fontSize: 'calc(var(--font-size) * 1.25)',
            lineHeight: 'calc(var(--line-px) * 1.25)',
            letterSpacing: '-0.01em',
          }}>
            I build software with curiosity and discipline. My work spans AI systems,
            data pipelines, and full-stack applications — always focused on clarity,
            reliability, and the people who use what I make.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="col w4">
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.08)' }}>
            Currently exploring agentic workflows and how language models
            can reason through complex research tasks. Previously built
            real-time monitoring systems processing millions of telemetry
            events, and knowledge management tools that combine semantic
            search with graph-based navigation.
          </p>
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.08)', marginTop: 'var(--line-px)' }}>
            I value simplicity over cleverness, and believe that good
            software is legible software. When I&apos;m not coding, you&apos;ll
            find me reading, writing about design constraints, or
            thinking about what makes tools actually useful.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="section space">
        <div className="col w8">
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

      {/* Contact CTA */}
      <section className="section space">
        <div className="col w5">
          <p className="mega" style={{ fontSize: 'calc(var(--font-size) * 1.8)' }}>
            Let&apos;s build something.
          </p>
          <div style={{ display: 'flex', gap: 'var(--char)', marginTop: 'var(--line-px)' }}>
            <a href="/contact" className="button">
              Get in touch
            </a>
            <a
              href="https://github.com/yourname"
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
