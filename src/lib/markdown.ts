import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

marked.setOptions({
  gfm: true,
  breaks: false,
})

export function renderMarkdown(md: string): string {
  const raw = marked.parse(md) as string
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: 'a',
        attribs: { ...attribs, rel: 'noopener noreferrer', target: attribs.target || '_blank' },
      }),
    },
  })
}

export function renderExcerpt(md: string, words = 40): string {
  const text = md.replace(/[#__*>`~\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim()
  const parts = text.split(' ').slice(0, words).join(' ')
  return parts + (text.split(' ').length > words ? '…' : '')
}
