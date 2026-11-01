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
- npm run start : Start production server
- npm run lint : Run lint checks

## Deployment
This repository exports static files to `out/` for Cloudflare Pages. The build
also generates Markdown assets, a Pages advanced-mode `_worker.js`, and a
`_routes.json` that runs the worker only for page URLs.

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
Token counts are omitted because no tokenizer is configured.

To test negotiation locally, run `npm run build`, then
`npx wrangler pages dev out --port 8788` and use the curl command above with
`http://localhost:8788`. The Next.js development server and plain static servers
do not execute the Cloudflare worker. Deployments must include the generated
worker; uploading only the HTML files will not enable content negotiation.

## Notes
- The shared navigation provides links to Projects, Commentary, About, and Contact.
- The portfolio uses a responsive text-grid system; project cards collapse to a single column on small screens.
