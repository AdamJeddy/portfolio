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
- npm run start : Start production server
- npm run lint : Run lint checks

## Deployment
This repository is configured for Cloudflare deployment and includes wrangler.jsonc.

Typical production flow:
- Build with npm run build
- Deploy with your Cloudflare pipeline or Wrangler configuration

## Notes
- The shared navigation provides links to Projects, Commentary, About, and Contact.
- The portfolio uses a responsive text-grid system; project cards collapse to a single column on small screens.
