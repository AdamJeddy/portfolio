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
        <div className="col w8" style={{ flexDirection: 'row', gap: 'var(--char2)', alignItems: 'flex-start' }}>
          <div className="col w2">
            <div className="profile-image">
              <span>⬡</span>
            </div>
          </div>
          <div className="col w5">
            <p className="mega">
              Adam — Software Engineer. AI + Data.
            </p>
            <p style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginTop: 'var(--line-px)',
              opacity: 0.5,
            }}>
              Gothenburg, Sweden · Available for projects
            </p>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal type="slide-up">
        <section className="section">
        <div className="col w4">
          <p style={{
            fontFamily: 'var(--font-geist-sans), var(--font-sans)',
            fontSize: 'calc(var(--font-size) * 1.25)',
            lineHeight: 'calc(var(--line-px) * 1.4)',
            letterSpacing: '-0.01em',
          }}>
            I build software with curiosity and discipline. My work spans AI
            systems, data pipelines, and full-stack applications — always focused
            on clarity, reliability, and the people who use what I make.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="col w4">
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)' }}>
            Currently exploring agentic workflows — how language models can
            plan, retrieve, and reason through complex research tasks
            autonomously. Previously built real-time monitoring systems
            processing millions of telemetry events per second, detecting
            anomalies across distributed sensor networks.
          </p>
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)', marginTop: 'var(--line-px)' }}>
            I also built a personal knowledge management tool that combines
            traditional note-taking with semantic search and graph-based
            navigation — because I believe the tools we use to think shape
            the quality of our thinking.
          </p>
          <p style={{ lineHeight: 'calc(var(--line-px) * 1.15)', marginTop: 'var(--line-px)' }}>
            I value simplicity over cleverness. Good software is legible
            software — code that tells a clear story, systems that fail
            gracefully, and interfaces that don&apos;t make you think. When
            I&apos;m not coding, you&apos;ll find me reading about design
            constraints, writing about what makes tools useful, or
            iterating on side projects.
          </p>
        </div>
      </section>
      </Reveal>

      {/* Skills */}
      <Reveal type="slide-up">
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
      </Reveal>

      {/* Contact CTA */}
      <Reveal type="slide-up">
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
      </Reveal>
    </div>
  )
}
