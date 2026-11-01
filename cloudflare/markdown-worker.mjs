function prefersMarkdown(accept = '') {
  const types = accept.toLowerCase().split(',').map(part => {
    const [type, ...parameters] = part.trim().split(';').map(value => value.trim())
    const quality = parameters.find(value => value.startsWith('q='))?.slice(2) ?? '1'
    return { type, quality: /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(quality) ? Number(quality) : 0 }
  })
  const markdown = types.find(item => item.type === 'text/markdown')?.quality ?? 0
  const html = ['text/html', 'text/*', '*/*']
    .map(type => types.find(item => item.type === type)?.quality)
    .find(quality => quality !== undefined) ?? 0
  return markdown > 0 && markdown >= html
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-Frame-Options': 'DENY',
  }
}

export function createMarkdownWorker(pages) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url)
      const isHomepage = url.pathname === '/'
      if (!['GET', 'HEAD'].includes(request.method) || !Object.hasOwn(pages, url.pathname)) {
        return env.ASSETS.fetch(request)
      }

      const markdown = prefersMarkdown(request.headers.get('Accept') ?? '')
      const assetPath = pages[url.pathname]
      let assetRequest = request
      if (markdown) {
        url.pathname = assetPath
        assetRequest = new Request(url, request)
      }
      const asset = await env.ASSETS.fetch(assetRequest)
      const response = new Response(asset.body, asset)
      if (response.ok || response.status === 304) {
        // Discovery links are appended after any Link header the asset already carries,
        // so the alternate/describedby set is consistent on every page response.
        response.headers.append('Link', `<${url.origin}${assetPath}>; rel="alternate"; type="text/markdown"`)
        response.headers.append('Link', '</llms.txt>; rel="describedby"; type="text/plain"')
        if (isHomepage) {
          response.headers.append('Link', '</site-description.jsonld>; rel="describedby"; type="application/ld+json"')
        }
        // Cloudflare does not apply public/_headers to Pages Functions responses,
        // so page responses get their security headers here.
        for (const [name, value] of Object.entries(securityHeaders())) response.headers.set(name, value)
      }
      const vary = response.headers.get('Vary')?.split(',').map(value => value.trim()) ?? []
      if (!vary.some(value => ['accept', '*'].includes(value.toLowerCase()))) vary.push('Accept')
      response.headers.set('Vary', vary.join(', '))
      if (markdown && (response.ok || response.status === 304)) {
        response.headers.set('Content-Type', 'text/markdown; charset=utf-8')
      }
      return response
    },
  }
}
