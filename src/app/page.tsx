import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata = createPageMetadata({
  path: '/',
  title: "Adam's Portfolio",
  description: 'Projects, commentary, and experiments by Adam.',
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
  const featuredProject = projects[0]
  const featuredPosts = posts.slice(0, 2)

  return (
    <div className="content-layer home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />

      <Reveal type="slide-up">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-index" aria-label="Page index">
            <span>Home</span>
            <span>00</span>
            <span>Selected index</span>
          </div>

          <div className="home-hero-copy">
            <h1 id="home-title" className="home-name">Adam Ahsan</h1>
            <p className="home-tagline">Building things, following ideas, and leaving a few notes behind.</p>
          </div>

          <dl className="home-meta">
            <div>
              <dt>Location</dt>
              <dd>Dubai, UAE</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Technology × Creativity</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Building and writing</dd>
            </div>
          </dl>
        </section>
      </Reveal>

      <Reveal type="slide-up">
        <div className="home-feature-grid">
          {featuredProject && (
            <section className="home-feature-project" aria-labelledby="featured-project-title">
              <div className="home-feature-heading">
                <h2 id="featured-project-title">Featured project</h2>
                <Link href="/projects">View all →</Link>
              </div>

              <Link
                href={`/projects/${featuredProject.slug}`}
                className="home-project-link"
              >
                <div className="home-project-title-row">
                  <h3>{featuredProject.title}</h3>
                  <span>{featuredProject.year ?? '—'}</span>
                </div>
                <p>{featuredProject.description}</p>
                <span className="home-project-cta">View project →</span>
              </Link>
            </section>
          )}

          <section className="home-feature-commentary" aria-labelledby="featured-commentary-title">
            <div className="home-feature-heading">
              <h2 id="featured-commentary-title">Featured commentary</h2>
              <Link href="/writing">View all →</Link>
            </div>

            <ol className="home-commentary-list">
              {featuredPosts.map((post, index) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`}>
                    <span className="home-commentary-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="home-commentary-title">{post.title}</span>
                    <span className="home-commentary-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </Reveal>
    </div>
  )
}
