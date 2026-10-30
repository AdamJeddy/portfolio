import Image from 'next/image'
import Link from 'next/link'
import type { ProjectItem } from '@/lib/projects'
import {
  laylaCommerceFeatures,
  laylaEntryPoints,
  laylaPassportFeatures,
  laylaPassportOverview,
  laylaProductAreas,
  laylaProductFlow,
} from '@/lib/layla-showcase'
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
            <p className={styles.eyebrow}>Meet Layla</p>
            <h1 id="layla-title">Beauty advice that leads somewhere.</h1>
            <p className={styles.lede}>
              Layla is an AI beauty coach inside the FACES app. Ask a beauty question,
              get personalised guidance, discover relevant products, and add them to your bag
              without leaving the conversation.
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
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/signal/layla-fragrance-mobile.webp" width="800" height="1067" />
              <Image
                src="/images/signal/layla-fragrance-showcase.webp"
                alt="Layla AI in the FACES app recommending Tom Ford Ombré Leather and Armani Stronger With You Absolutely."
                width={1200}
                height={900}
                priority
                unoptimized
                sizes="(max-width: 768px) 92vw, 54vw"
              />
            </picture>
            <figcaption>Advice, product discovery, and shopping in one conversation.</figcaption>
          </figure>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Layla page sections">
        <a href="#how-layla-works">How it works</a>
        <a href="#beauty-passport">Beauty Passport</a>
        <a href="#shop-with-layla">Shop with Layla</a>
        <a href="#entry-points">Entry points</a>
        <a href="#my-role">My role</a>
        <a href="#try-layla">Try Layla</a>
      </nav>

      <section className={styles.introduction} aria-labelledby="introduction-title">
        <p className={styles.eyebrow}>More than product search</p>
        <h2 id="introduction-title">A beauty conversation, built into the shop.</h2>
        <p>
          Beauty shopping gets complex when the answer depends on a person’s tastes, needs,
          and routine. Layla brings the feel of a helpful beauty advisor to the same place where
          customers browse and buy.
        </p>
      </section>

      <section id="how-layla-works" className={styles.flow} aria-labelledby="flow-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>The product flow</p>
          <h2 id="flow-title">From question to bag.</h2>
        </div>
        <ol>
          {laylaProductFlow.map((step) => (
            <li key={step.number}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="beauty-passport" className={styles.experience} aria-labelledby="experience-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Beauty Passport</p>
          <h2 id="experience-title">Built around the person, not a generic profile.</h2>
        </div>
        <div className={styles.passportOverview}>
          <figure className={styles.passportOverviewVisual}>
            <Image
              src={laylaPassportOverview.src}
              alt={laylaPassportOverview.alt}
              width={laylaPassportOverview.width}
              height={laylaPassportOverview.height}
              unoptimized
              sizes="(max-width: 768px) 82vw, 34vw"
            />
          </figure>
          <div className={styles.passportOverviewCopy}>
            <p className={styles.eyebrow}>{laylaPassportOverview.label}</p>
            <h3>{laylaPassportOverview.title}</h3>
            <p>{laylaPassportOverview.description}</p>
            <dl>
              <div><dt>01</dt><dd>Scent preferences</dd></div>
              <div><dt>02</dt><dd>Skin assessment</dd></div>
              <div><dt>03</dt><dd>Products already owned</dd></div>
            </dl>
          </div>
        </div>
        <div className={styles.passportFeatureGrid}>
          {laylaPassportFeatures.map((screen) => (
            <article className={styles.passportFeature} key={screen.label}>
              <div className={styles.passportScreenFrame}>
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  unoptimized
                  sizes="(max-width: 768px) 87vw, 28vw"
                />
              </div>
              <div className={styles.passportFeatureCopy}>
                <p className={styles.eyebrow}>{screen.label}</p>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="shop-with-layla" className={styles.commerce} aria-labelledby="commerce-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Personalised commerce</p>
          <h2 id="commerce-title">Advice that stays close to a useful next step.</h2>
        </div>
        <div className={styles.commerceFeatureGrid}>
          {laylaCommerceFeatures.map((screen, index) => (
            <article className={`${styles.commerceFeature} ${index === 0 ? styles.commerceFeatureLead : ''}`} key={screen.label}>
              <div className={styles.commerceCopy}>
                <p className={styles.eyebrow}>{screen.label}</p>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
              <figure className={styles.commerceScreenFrame}>
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  unoptimized
                  sizes={index === 0 ? '(max-width: 768px) 87vw, 38vw' : '(max-width: 768px) 87vw, 27vw'}
                />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.categories} aria-labelledby="categories-title">
        <p className={styles.eyebrow}>Where Layla can help</p>
        <h2 id="categories-title" className="sr-only">Beauty categories</h2>
        <ul>
          {laylaProductAreas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </section>

      <section id="entry-points" className={styles.entryPoints} aria-labelledby="entry-points-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Right where it is needed</p>
          <h2 id="entry-points-title">Layla meets the shopper inside the journey.</h2>
        </div>
        <div className={styles.entryPointGrid}>
          {laylaEntryPoints.map((entryPoint) => (
            <article className={styles.entryPoint} key={entryPoint.label}>
              <div className={styles.entryPointScreenshot}>
                <Image
                  src={entryPoint.src}
                  alt={entryPoint.alt}
                  width={entryPoint.width}
                  height={entryPoint.height}
                  unoptimized
                  sizes="(max-width: 768px) 42vw, 14vw"
                />
              </div>
              <div>
                <p className={styles.eyebrow}>{entryPoint.label}</p>
                <h3>{entryPoint.title}</h3>
                <p>{entryPoint.description}</p>
              </div>
            </article>
          ))}
          <aside className={styles.supportNote} aria-labelledby="support-title">
            <p className={styles.eyebrow}>Beyond the bag</p>
            <h3 id="support-title">Support can stay conversational, too.</h3>
            <p>
              Layla can carry the relationship beyond discovery with help for orders,
              delivery updates, and the next beauty question a customer has.
            </p>
            <ul>
              <li>Order help</li>
              <li>Delivery status</li>
              <li>Routine follow-up</li>
            </ul>
          </aside>
        </div>
      </section>

      <section id="my-role" className={styles.role} aria-labelledby="role-title">
        <div>
          <p className={styles.eyebrow}>My role</p>
          <h2 id="role-title">Making Layla feel native to FACES.</h2>
        </div>
        <div className={styles.roleCopy}>
          <p>
            I led Layla&apos;s technical integration into the FACES app, connecting the
            assistant to a customer-facing beauty shopping experience.
          </p>
          <ul>
            <li>AI assistant integration</li>
            <li>Mobile product experience</li>
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
