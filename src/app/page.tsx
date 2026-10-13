import Image from 'next/image'
import Link from 'next/link'
import { Newsreader } from 'next/font/google'
import NotebookStory from '@/components/NotebookStory'
import { createPageMetadata } from '@/lib/metadata'
import { posts } from '@/lib/posts'
import { projects } from '@/lib/projects'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './notebook.css'

const editorial = Newsreader({ subsets: ['latin'], display: 'swap', variable: '--font-editorial' })

export const metadata = createPageMetadata({
  path: '/', title: "Adam's Portfolio",
  description: 'Projects, commentary, and experiments by Adam.',
})

const websiteJsonLd = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`, url: SITE_URL,
  name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: 'en',
})

export default function Home() {
  const entries = [
    ...projects.slice(0, 2).map((project, index) => ({
      title: project.title, description: project.description,
      href: `/projects/${project.slug}`,
      label: index === 0 ? 'Build / Selected work' : 'Explore / Personal project',
    })),
    { title: 'Thinking out loud.', description: 'A few notes on technology, creativity, and the things in between.', href: '/writing', label: 'Write / Commentary' },
  ]

  return (
    <div className={`notebook-page ${editorial.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <a className="notebook-skip" href="#selected-work">Skip to selected work</a>
      <NotebookStory entries={entries} />
      <section className="notebook-work notebook-section" id="selected-work" aria-labelledby="work-title">
        <div className="notebook-section-heading">
          <p className="notebook-eyebrow">01 / A few things I&apos;ve made</p>
          <h2 id="work-title">Selected work.</h2>
          <Link className="notebook-link" href="/projects">All projects <Image src="/icons/arrow-up-right.svg" alt="" width={18} height={18} /></Link>
        </div>
        <div className="notebook-projects">
          {projects.map((project, index) => (
            <article id={`project-${project.slug}`} className="notebook-project" key={project.slug}>
              <Link className="notebook-project-art" href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
                <Image src={`/images/notebook/${index === 0 ? 'layla' : 'qeemat'}-sheet.webp`} alt="" width={900} height={1350} unoptimized sizes="(max-width: 768px) 90vw, 45vw" />
              </Link>
              <div className="notebook-project-caption">
                <p className="notebook-eyebrow">{String(index + 1).padStart(2, '0')} / {project.year}</p>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}<Image src="/icons/arrow-up-right.svg" alt="" width={28} height={28} /></Link></h3>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="notebook-writing notebook-section" id="notebook-writing" aria-labelledby="writing-title">
        <div className="notebook-section-heading">
          <p className="notebook-eyebrow">02 / From the notebook</p>
          <h2 id="writing-title">Thinking out loud.</h2>
          <Link className="notebook-link" href="/writing">All commentary <Image src="/icons/arrow-up-right.svg" alt="" width={18} height={18} /></Link>
        </div>
        <ol className="notebook-posts">
          {posts.slice(0, 3).map((post, index) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`}>
                <span className="notebook-eyebrow">{String(index + 1).padStart(2, '0')}</span>
                <h3>{post.title}</h3>
                <span className="notebook-post-time">{post.readingTime}</span>
                <Image src="/icons/arrow-up-right.svg" alt="" width={24} height={24} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="notebook-contact notebook-section" aria-labelledby="contact-title">
        <p className="notebook-eyebrow">Still a work in progress</p>
        <h2 id="contact-title">On to the<br /><em>next idea.</em></h2>
        <Link className="notebook-link" href="/contact">Let&apos;s talk <Image src="/icons/arrow-up-right.svg" alt="" width={20} height={20} /></Link>
        <Link className="notebook-about-link" href="/about">A little more about me</Link>
      </section>
    </div>
  )
}
