import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import domino from '@mixmark-io/domino'
import TurndownService from 'turndown'

export function htmlToMarkdown(html, url) {
  const document = domino.createWindow(html).document
  const main = document.querySelector('main')
  if (!main) throw new Error(`Missing main content: ${url}`)
  const structuredData = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(script => script.textContent.trim()).filter(Boolean)
  for (const element of main.querySelectorAll('script, style, nav, footer, [hidden], [aria-hidden="true"], img[alt=""]')) {
    element.remove()
  }
  for (const element of main.querySelectorAll('a[href], img[src]')) {
    const attribute = element.tagName === 'A' ? 'href' : 'src'
    element.setAttribute(attribute, new URL(element.getAttribute(attribute), url).href)
  }
  // Card links wrap headings in HTML; Markdown requires the link inside the heading.
  for (const link of main.querySelectorAll('a[href]')) {
    const heading = link.querySelector('h1, h2, h3, h4, h5, h6')
    if (!heading) continue
    const inlineLink = document.createElement('a')
    inlineLink.setAttribute('href', link.getAttribute('href'))
    while (heading.firstChild) inlineLink.appendChild(heading.firstChild)
    heading.appendChild(inlineLink)
    const container = document.createElement('div')
    while (link.firstChild) container.appendChild(link.firstChild)
    link.replaceWith(container)
  }
  const converter = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' })
  converter.addRule('definitionLists', {
    filter: ['dt', 'dd'],
    replacement: content => `\n\n${content}\n\n`,
  })
  const metadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    url,
  }
  const frontmatter = Object.entries(metadata).filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
  const jsonLd = structuredData.length ? `\n\n\`\`\`json\n${structuredData.join('\n')}\n\`\`\`` : ''
  return `---\n${frontmatter}\n---\n\n${converter.turndown(main.innerHTML)}${jsonLd}\n`
}

export async function generateMarkdown(outputDirectory) {
  const pages = {}
  const files = await readdir(outputDirectory, { recursive: true })
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const name = file.split(sep).join('/')
    if (name === '404.html' || name.startsWith('_not-found')) continue
    const html = await readFile(join(outputDirectory, file), 'utf8')
    const document = domino.createWindow(html).document
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    if (!canonical) throw new Error(`Missing canonical URL: ${file}`)
    const assetPath = `/_markdown/${name.replace(/\.html$/, '.md')}`
    const destination = join(outputDirectory, assetPath)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, htmlToMarkdown(html, canonical))
    const route = name === 'index.html' ? '/' : `/${name.replace(/(?:\/index)?\.html$/, '')}`
    pages[route] = assetPath
    if (route !== '/') pages[`${route}/`] = assetPath
    pages[`/${name}`] = assetPath
  }
  const worker = await readFile(new URL('../cloudflare/markdown-worker.mjs', import.meta.url), 'utf8')
  await writeFile(join(outputDirectory, '_worker.js'), `${worker}\nexport default createMarkdownWorker(${JSON.stringify(pages, null, 2)})\n`)
  await writeFile(join(outputDirectory, '_routes.json'), JSON.stringify({ version: 1, include: Object.keys(pages), exclude: [] }, null, 2))
  console.log(`Generated Markdown for ${new Set(Object.values(pages)).size} pages in ${relative(process.cwd(), outputDirectory)}.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateMarkdown(fileURLToPath(new URL('../out/', import.meta.url)))
}
