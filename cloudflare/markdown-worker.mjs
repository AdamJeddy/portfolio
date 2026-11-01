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

export function createMarkdownWorker(pages) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url)
      if (!['GET', 'HEAD'].includes(request.method) || !Object.hasOwn(pages, url.pathname)) {
        return env.ASSETS.fetch(request)
      }

      const markdown = prefersMarkdown(request.headers.get('Accept') ?? '')
      let assetRequest = request
      if (markdown) {
        url.pathname = pages[url.pathname]
        assetRequest = new Request(url, request)
      }
      const asset = await env.ASSETS.fetch(assetRequest)
      const response = new Response(asset.body, asset)
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
