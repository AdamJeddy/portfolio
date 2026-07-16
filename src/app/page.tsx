import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata = createPageMetadata({
  path: '/',
  title: "Adam's Portfolio — Projects, Writing & Experiments",
  description: 'A personal collection of projects, writing, and experiments by Adam.',
})

const websiteJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
})

export default function Home() {
  return (
    <div className="content-layer">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />

      {/* ── Hero ────────────────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section home-intro">
          <div className="col wfull">
            <p className="eyebrow">Software engineering · AI + data</p>
            <h1 className="mega home-name">Adam</h1>
            <p className="home-tagline">
              I curiously build things
            </p>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Work ───────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section home-section">
          <div className="col wfull">
            <div className="section-heading-row">
              <h2 className="section-heading">Selected work</h2>
              <Link href="/projects" className="section-link">View all →</Link>
            </div>

            <ul className="linelist">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="line">
                    <div className="home-item-main">
                      <span className="home-item-title">{project.title}</span>
                      <span className="home-item-description">
                        {project.description}
                      </span>
                    </div>
                    <span>{project.year ?? '—'}</span>
                  </Link>
                </li>
              ))}
            </ul>

        </div>
      </section>
      </Reveal>

      {/* ── Latest Writing ──────────────────────────────── */}
      <Reveal type="slide-up">
        <section className="section home-section">
          <div className="col wfull">
            <div className="section-heading-row">
              <h2 className="section-heading">Latest writing</h2>
              <Link href="/writing" className="section-link">View all →</Link>
            </div>

            <ul className="linelist">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className="line">
                    <span className="home-writing-title">
                      {post.image && (
                        // Static export uses raw images until a Cloudflare-compatible
                        // image loader is introduced.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt=""
                          style={{
                            width: '48px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '2px',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

    </div>
  )
}
