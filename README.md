# Adam Portfolio

A Next.js portfolio site with a text-canvas visual style, project and commentary sections, and app policy pages.

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4

## Routes
- / : Landing page
- /projects : Projects index
- /projects/[slug] : Individual project page
- /writing : Commentary index
- /writing/[slug] : Individual commentary page
- /about : Personal page
- /contact : Contact page
- /track-my-salah-privacy-policy : Privacy policy page for the Track My Salah app

## Local Development
Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Default local URL:

http://localhost:3000

## Scripts
- npm run dev : Run development server
- npm run build : Build for production
- npm test : Run regression tests
- npm run preview : Serve the exported out/ directory locally
- npm run lint : Run lint checks

Node.js 22.18 or newer is required (the test suite runs TypeScript library modules directly).

## Deployment
This repository exports static files to `out/` for Cloudflare Pages. The build
also generates Markdown assets, the `llms.txt` / `llms-full.txt` agent indexes, a
Pages advanced-mode `_worker.js`, and a `_routes.json` that runs the worker only
for page URLs.

Typical production flow:
- Build with npm run build
- Deploy `out/` with your Cloudflare Pages pipeline or `npx wrangler pages deploy out`

## Markdown for agents

Request any page at its usual URL with `Accept: text/markdown`:

```bash
curl -H "Accept: text/markdown" https://bruh.ae/projects/qeemat
```

The response uses `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`.
HTML remains the default, including wildcard Accept headers. Explicit media type
quality values are respected; Markdown wins equal preferences when explicitly
requested. GET and HEAD are supported. Assets and unknown routes use normal
Cloudflare handling.

Markdown is generated from each exported page's main content, keeping metadata,
headings, lists, absolute links, and JSON-LD without navigation, styles, or scripts.
The build uses Domino and Turndown; neither ships in the browser or worker.
Frontmatter carries `title`, `description`, `url`, and — when the page's JSON-LD
provides them — `author`, `datePublished`, `dateModified`, and `site`. Missing
data is omitted rather than invented. Adjacent inline elements (for example a
row of CTA links) are separated with a space so links cannot run together.
Token counts are omitted because no tokenizer is configured.

### Discovery files

The build writes two agent indexes to the output root:

- `/llms.txt` — an llmstxt.org-style index: an H1 for the person entity, a
  blockquote summary derived from the homepage `Person` + `WebSite` JSON-LD
  graph (name, description, job title, locality/country, `sameAs` profiles), a
  `## Profiles` link list, curated `## Pages` links to the Markdown mirror of
  every clean route, a `## Optional` section for the privacy policy, and a short
  `## About this file` note.
- `/llms-full.txt` - the Markdown text of every indexable page under one top-level
  H1, with an `##` section per page carrying its canonical URL and body (the
  noindex privacy page is excluded). The build warns if it grows past 200 KB.

If the homepage graph has no `Person` node, the generator still emits both files
from the `WebSite` data and logs a warning instead of failing the build.

Worker-served page responses advertise both representations with `Link` headers
(appended after any `Link` header the asset already carries, alternate first):

```
Link: <https://bruh.ae/_markdown/<path>.md>; rel="alternate"; type="text/markdown"
Link: </llms.txt>; rel="describedby"; type="text/plain"
```

The homepage also keeps
`Link: </site-description.jsonld>; rel="describedby"; type="application/ld+json"`.
`site-description.jsonld` is the homepage structured-data graph copied verbatim,
so it stays in sync with the page.

### Response headers

Security headers for page responses are set in `cloudflare/markdown-worker.mjs`
(`X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, `Permissions-Policy: camera=(),
microphone=(), geolocation=()`, `X-Frame-Options: DENY`) along with a
`Content-Signal: search=yes, ai-train=no, use=reference` header that mirrors the
current Cloudflare-managed robots policy. They cannot live in `public/_headers`:
Cloudflare does not apply custom headers to Pages Functions responses, and page
URLs are worker-served. `public/_headers` covers static assets only - the same
baseline security headers under `/*`, the `site-description.jsonld` content type,
`/_markdown/*` content type plus `X-Robots-Tag: noindex` (the mirrors are fetch
targets, not search results), and immutable caching for `/_next/static/*`.

Negotiated Markdown responses are additionally marked
`Cache-Control: private, max-age=0, must-revalidate` and carry
`Content-Location` pointing at the `/_markdown/*.md` asset, so a shared cache can
never store the Markdown variant under the page URL. No CSP is configured; that
needs a separate decision.

### Routing and route growth

`out/_routes.json` registers only clean page routes (`/`, `/about`, …) — one per
page, 11 rules today — because Cloudflare Pages 308-redirects the trailing-slash
and `.html` variants before a Function is consulted. The worker's page map still
lists those variants for direct requests. Pages caps `_routes.json` at 100
combined include/exclude rules, so the build throws if include rules exceed 90;
before that happens, replace the per-page list with wildcards and excludes.

### Entity and structured data

`src/lib/schema.ts` is the single source of truth for the JSON-LD graph: a
`Person` (`#person`) with `sameAs` profiles, job title, Dubai address and image;
a `WebSite` (`#website`, alternate name `bruh.ae`); `ProfilePage` on `/about`;
connected `Article` nodes (Person `@id` author, ISO `+04:00` dates, URL,
`mainEntityOfPage`, `isPartOf`); and project entities - `SoftwareApplication` for
Qeemat and `CreativeWork` for Layla AI, where Adam Ahsan is recorded as a
contributor (technical integration), not the creator. Pages that reference
`#person` or `#website` publish those nodes in the same graph so every `@id`
resolves on the page. The sitemap publishes `lastModified` only for articles,
where a real content date exists.

### Production robots.txt

`src/app/robots.ts` emits an allow-all file, but production
`https://bruh.ae/robots.txt` is managed by Cloudflare's AI bot policy (dashboard:
Security → Bot traffic → AI bot policies). The managed directives are prepended
before the repo's file, and specific user-agent groups (including training-crawler
`Disallow` rules) cannot be overridden by `robots.ts`; whether those crawlers are
edge-blocked is also dashboard-controlled. After any dashboard change, verify the
live file and document the chosen posture here:

```bash
curl -s https://bruh.ae/robots.txt
```

### Local verification

Run `npm run build`, then `npx wrangler pages dev out --port 8788` and use:

```bash
curl -sI -H 'Accept: text/markdown' http://localhost:8788/about
curl -s http://localhost:8788/llms.txt
```

The Next.js development server and plain static servers do not execute the
Cloudflare worker. Deployments must include the generated worker; uploading only
the HTML files will not enable content negotiation or the discovery headers.

## Notes
- The shared navigation provides links to Projects, Commentary, About, and Contact.
- The portfolio uses a responsive text-grid system; project cards collapse to a single column on small screens.
