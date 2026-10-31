import Image from 'next/image'
import Link from 'next/link'
import { Inter_Tight } from 'next/font/google'
import SignalMotion from '@/components/SignalMotion'
import { createPageMetadata } from '@/lib/metadata'
import { homepageProjects } from '@/lib/homepage-projects'
import { posts } from '@/lib/posts'
import { getProjectBySlug } from '@/lib/projects'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './signal.css'

const display = Inter_Tight({ subsets: ['latin'], display: 'swap', variable: '--font-signal' })

export const metadata = createPageMetadata({
  path: '/', title: "Adam's Portfolio",
  description: 'Projects, commentary, and experiments by Adam.',
})
const websiteJsonLd = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`, url: SITE_URL,
  name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: 'en',
})

function Arrow({ light = false }: { light?: boolean }) {
  return <Image className={light ? 'signal-arrow signal-arrow-light' : 'signal-arrow'} src="/icons/arrow-up-right.svg" alt="" width={24} height={24} />
}

export default function Home() {
  return (
    <div className={`signal-page ${display.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <SignalMotion />
      <a className="signal-skip" href="#selected-work">Skip to selected work</a>
      <section className="signal-hero" aria-labelledby="signal-title">
        <h1 id="signal-title"><span><span>Good</span> <span>ideas.</span></span><span><span>Useful</span> <span>things.</span></span></h1>
        <div className="signal-intro">
          <div className="signal-identity"><p>Adam Ahsan</p><span className="signal-label">Dubai, UAE</span></div>
          <div className="signal-intro-copy">
            <p>Technology, creativity,<br />and a habit of making things.</p>
            <a className="signal-link" href="#selected-work">See what I am building <Arrow /></a>
          </div>
        </div>
      </section>
      <div id="selected-work" className="signal-work" aria-label="Selected work">
        {homepageProjects.map((feature, index) => {
          const project = getProjectBySlug(feature.slug)
          if (!project) return null
          return (
            <section className={`signal-project signal-project-${feature.slug}`} key={feature.slug} aria-labelledby={`title-${feature.slug}`}>
              <div className="signal-project-copy">
                <div className="signal-project-label">
                  <p className="signal-label">{feature.label}</p>
                  {'brand' in feature && <Image className="signal-project-brand" src={feature.brand.src} alt={feature.brand.alt} width={feature.brand.width} height={feature.brand.height} unoptimized />}
                </div>
                <h2 id={`title-${feature.slug}`}><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                <p className="signal-project-summary">{feature.summary}</p>
                <Link className="signal-link" href={`/projects/${project.slug}`}>View project <Arrow light={index === 0} /></Link>
              </div>
              <figure className="signal-project-visual">
                <div className="signal-image-frame">
                  <picture>
                    {'mobile' in feature && <source media="(max-width: 768px)" srcSet={feature.mobile.src} width={feature.mobile.width} height={feature.mobile.height} />}
                    <Image src={feature.src} alt={feature.alt} width={feature.width} height={feature.height} unoptimized priority={index === 0} sizes="(max-width: 768px) 90vw, 58vw" />
                  </picture>
                </div>
                <figcaption className="signal-label">{feature.caption}</figcaption>
              </figure>
            </section>
          )
        })}
      </div>
      <section className="signal-writing signal-section" aria-labelledby="writing-title">
        <div className="signal-section-label"><p className="signal-label">Commentary</p><Link className="signal-label" href="/writing">All commentary <Arrow /></Link></div>
        <h2 id="writing-title">Thinking out loud.</h2>
        <ol>
          {posts.slice(0, 3).map(post => (
            <li key={post.slug}><Link href={`/writing/${post.slug}`}><h3>{post.title}</h3><Arrow /></Link></li>
          ))}
        </ol>
      </section>
      <section className="signal-contact signal-section" aria-labelledby="contact-title">
        <div className="signal-section-label"><p className="signal-label">Contact</p><Link className="signal-label" href="/about">A little about me <Arrow /></Link></div>
        <h2 id="contact-title">What&apos;s next?<br /><Link href="/contact">Let&apos;s talk.<Arrow /></Link></h2>
      </section>
    </div>
  )
}
