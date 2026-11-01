import Image from 'next/image'
import Link from 'next/link'
import type { ProjectItem } from '@/lib/projects'
import {
  laylaEditorialHero,
  laylaProductFlow,
  laylaReportedImpact,
} from '@/lib/layla-showcase'
import LaylaExperience from './LaylaExperience'
import styles from './LaylaShowcase.module.css'

interface LaylaShowcaseProps {
  project: ProjectItem
}

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>
}

export default function LaylaShowcase({ project }: LaylaShowcaseProps) {
  const appStoreLink = project.links.find((link) => link.label.includes('App Store'))
  const googlePlayLink = project.links.find((link) => link.label.includes('Google Play'))
  const launchStoryLink = project.links.find((link) => link.label.includes('launch story'))

  return (
    <article className={`${styles.showcase} layla-showcase`}>
      <section className={styles.hero} aria-labelledby="layla-title">
        <div className={styles.heroTopline}>
          <Link href="/projects" className={styles.backLink}>All projects</Link>
          <Image
            className={styles.facesLogo}
            src="/images/signal/faces-logo.svg"
            alt="FACES"
            width={589}
            height={165}
            unoptimized
          />
          <p>AI beauty coach / FACES app</p>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>FACES / Layla AI</p>
            <h1 id="layla-title">Layla AI — personal beauty advice, built into FACES.</h1>
            <p className={styles.lede}>
              It helps customers discover products, build routines, get product-specific guidance,
              and check out from one conversation.
            </p>
            <div className={styles.heroActions}>
              {appStoreLink && (
                <a href={appStoreLink.href} target="_blank" rel="noopener noreferrer" className={styles.primaryAction}>
                  Try Layla on the App Store <ExternalArrow />
                </a>
              )}
              {googlePlayLink && (
                <a href={googlePlayLink.href} target="_blank" rel="noopener noreferrer" className={styles.secondaryAction}>
                  Get it on Google Play <ExternalArrow />
                </a>
              )}
            </div>
            <p className={styles.availability}>Available through the FACES mobile app.</p>
          </div>

          <figure className={styles.heroVisual}>
            {/* LCP hero: plain <img> inside <picture> shipping two WebP widths instead of one 2 MB PNG. */}
            <picture style={{ display: 'contents' }}>
              <source
                type="image/webp"
                srcSet={laylaEditorialHero.srcSet}
                sizes={laylaEditorialHero.sizes}
              />
              <img
                className={styles.editorialHero}
                src={laylaEditorialHero.src}
                alt={laylaEditorialHero.alt}
                width={laylaEditorialHero.width}
                height={laylaEditorialHero.height}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </figure>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Layla page sections">
        <a href="#entry-points">Where it lives</a>
        <a href="#beauty-passport">Beauty Passport</a>
        <a href="#shop-with-layla">Advice to bag</a>
        <a href="#after-purchase">After purchase</a>
        <a href="#reported-impact">Reported impact</a>
        <a href="#my-role">My role</a>
        <a href="#try-layla">Try Layla</a>
      </nav>

      <section className={styles.journey} aria-labelledby="journey-title">
        <h2 id="journey-title" className={styles.journeyLabel}>The product loop</h2>
        <ol>
          {laylaProductFlow.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <LaylaExperience />

      <section id="reported-impact" className={styles.outcome} aria-labelledby="outcome-title">
        <div>
          <p className={styles.eyebrow}>Reported launch impact</p>
          <h2 id="outcome-title">What the launch reported.</h2>
        </div>
        <div className={styles.outcomeCopy}>
          <p>
            Chalhoub Group reports stronger engagement and conversion for Layla sessions than
            non-AI sessions after launch.
          </p>
          <dl>
            {laylaReportedImpact.map((impact) => (
              <div key={impact.value}>
                <dt>{impact.value}</dt>
                <dd>{impact.description}</dd>
              </div>
            ))}
          </dl>
          {launchStoryLink && (
            <a href={launchStoryLink.href} target="_blank" rel="noopener noreferrer" className={styles.outcomeLink}>
              Read the official launch story <ExternalArrow />
            </a>
          )}
        </div>
      </section>

      <section id="my-role" className={styles.role} aria-labelledby="role-title">
        <div>
          <p className={styles.eyebrow}>My role</p>
          <h2 id="role-title">Making Layla feel native to FACES.</h2>
        </div>
        <div className={styles.roleCopy}>
          <p>
            I led Layla&apos;s technical integration into the FACES app, connecting the assistant
            to the places where customers discover, evaluate, and buy beauty products.
          </p>
          <ul>
            <li>AI assistant integration</li>
            <li>Search and PDP surfaces</li>
            <li>Conversational commerce</li>
          </ul>
        </div>
      </section>

      <section id="try-layla" className={styles.trySection} aria-labelledby="try-title">
        <div>
          <p className={styles.eyebrow}>Try the product</p>
          <h2 id="try-title">Meet Layla inside FACES.</h2>
        </div>
        <div className={styles.tryActions}>
          {appStoreLink && <a href={appStoreLink.href} target="_blank" rel="noopener noreferrer" className={styles.tryLink}>App Store <ExternalArrow /></a>}
          {googlePlayLink && <a href={googlePlayLink.href} target="_blank" rel="noopener noreferrer" className={styles.tryLink}>Google Play <ExternalArrow /></a>}
          {launchStoryLink && <a href={launchStoryLink.href} target="_blank" rel="noopener noreferrer" className={styles.launchLink}>Read the official launch story <ExternalArrow /></a>}
        </div>
      </section>
    </article>
  )
}
