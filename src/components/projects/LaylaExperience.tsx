import Image from 'next/image'
import {
  laylaCommerceActions,
  laylaCommerceLead,
  laylaEntryPoints,
  laylaOrderSupport,
  laylaPassportFeatures,
  laylaPassportOverview,
} from '@/lib/layla-showcase'
import styles from './LaylaShowcase.module.css'

export default function LaylaExperience() {
  return (
    <>
      <section id="entry-points" className={styles.entryPoints} aria-labelledby="entry-points-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Where it lives</p>
          <h2 id="entry-points-title">Layla meets customers at the point of hesitation.</h2>
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
                  sizes="(max-width: 768px) 40vw, 13vw"
                />
              </div>
              <div>
                <p className={styles.eyebrow}>{entryPoint.label}</p>
                <h3>{entryPoint.title}</h3>
                <p>{entryPoint.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="beauty-passport" className={styles.experience} aria-labelledby="experience-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Beauty Passport</p>
          <h2 id="experience-title">Context that gets more useful with every conversation.</h2>
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
              <div><dt>01</dt><dd>Scent quiz</dd></div>
              <div><dt>02</dt><dd>Skin assessment</dd></div>
              <div><dt>03</dt><dd>Beauty Shelf</dd></div>
            </dl>
            <p className={styles.passportFootnote}>
              Beauty Shelf gives Layla the routine context it needs: customers can add
              products they already own, including by identifying a product from an image.
            </p>
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
                  sizes="(max-width: 768px) 87vw, 33vw"
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
          <p className={styles.eyebrow}>From advice to bag</p>
          <h2 id="commerce-title">Personalised guidance with a clear next move.</h2>
        </div>
        <div className={styles.commerceLead}>
          <div className={styles.commerceCopy}>
            <p className={styles.eyebrow}>{laylaCommerceLead.label}</p>
            <h3>{laylaCommerceLead.title}</h3>
            <p>{laylaCommerceLead.description}</p>
          </div>
          <figure className={styles.commerceLeadScreen}>
            <Image
              src={laylaCommerceLead.src}
              alt={laylaCommerceLead.alt}
              width={laylaCommerceLead.width}
              height={laylaCommerceLead.height}
              unoptimized
              sizes="(max-width: 768px) 84vw, 40vw"
            />
          </figure>
        </div>
        <ol className={styles.commerceSequence}>
          {laylaCommerceActions.map((screen, index) => (
            <li key={screen.label}>
              <div className={styles.sequenceCopy}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p className={styles.eyebrow}>{screen.label}</p>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
              <figure className={styles.sequenceScreen}>
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  unoptimized
                  sizes="(max-width: 768px) 84vw, 31vw"
                />
              </figure>
            </li>
          ))}
        </ol>
        <p className={styles.platformNote}>
          <span>iOS checkout</span> Apple Pay can keep eligible purchases inside the conversation.
        </p>
      </section>

      <section id="after-purchase" className={styles.support} aria-labelledby="support-title">
        <div>
          <p className={styles.eyebrow}>Beyond the bag</p>
          <h2 id="support-title">Helpful after the purchase, not just before it.</h2>
        </div>
        <div className={styles.supportCopy}>
          <p>{laylaOrderSupport.description}</p>
          <ul>
            <li>Order support</li>
            <li>Delivery status</li>
            <li>Routine follow-up</li>
          </ul>
        </div>
        <figure className={styles.supportVisual}>
          <Image
            src={laylaOrderSupport.src}
            alt={laylaOrderSupport.alt}
            width={laylaOrderSupport.width}
            height={laylaOrderSupport.height}
            unoptimized
            sizes="(max-width: 768px) 82vw, 25vw"
          />
          <figcaption>Illustrative support state, derived from the FACES Layla experience.</figcaption>
        </figure>
      </section>
    </>
  )
}
