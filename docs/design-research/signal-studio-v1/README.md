# Signal Studio v1

The selected Signal Studio concept is implemented as a responsive homepage on `codex/signal-studio-v1`.

The lime hero leads into a blue Qeemat showcase, a pale Layla section, commentary, and contact. Native scrolling gently compresses the headline and expands project imagery. Reduced motion keeps the content static and fully visible.

Homepage copy and media are in `src/lib/homepage-projects.ts`. Core project and article content continues to come from existing data helpers. The Qeemat visual matches the approved concept. Layla now uses a generated premium product scene based on the uploaded screenshot: an angled phone, fragrance bottles, botanicals, and an ivory/sage plinth. The wide desktop and portrait mobile images are selected with a responsive picture source. Their interface details are illustrative recreations, including sample prices.

The built-in Image Gen tool produced both Layla assets. The production files are `public/images/signal/layla-premium-showcase.webp` (1200 x 900, 137,598 bytes) and `public/images/signal/layla-premium-mobile.webp` (800 x 1067, 120,474 bytes). Original transparent PNGs are in `source-assets/`; generation art direction is recorded in `layla-premium-art-direction.md`. The uploaded screenshot and first-version captures are retained as historical references.

The Layla section now includes the official FACES logo and an ivory/forest-green/gold treatment. The description identifies its integration into the FACES app. See `faces-brand-reference.md` for attribution and `layla-faces-desktop.png` / `layla-faces-mobile.png` for browser captures.

References, browser captures, comparisons, and original media are stored in this folder. See [design-qa.md](../../../design-qa.md) for verification and intentional responsive adaptations.

Development: `npm run dev`. Checks: `npm run build`, `npm run lint`, and `node --experimental-strip-types --test tests/signal-motion.test.mjs` (Node 22.6 or newer).
