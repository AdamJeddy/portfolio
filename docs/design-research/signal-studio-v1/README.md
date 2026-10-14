# Signal Studio v1

The selected Signal Studio concept is implemented as a responsive homepage on `codex/signal-studio-v1`.

The lime hero leads into a blue Qeemat showcase, a pale Layla section using the supplied screenshot, commentary, and contact. Native scrolling gently compresses the headline and expands project imagery. Reduced motion keeps the content static and fully visible.

Homepage copy and media are in `src/lib/homepage-projects.ts`. Core project and article content continues to come from existing data helpers. The Qeemat visual matches the approved concept; the Layla visual uses the uploaded image without reconstructing its interface.

References, browser captures, comparisons, and original media are stored in this folder. See [design-qa.md](../../../design-qa.md) for verification and intentional responsive adaptations.

Development: `npm run dev`. Checks: `npm run build`, `npm run lint`, and `node --experimental-strip-types --test tests/signal-motion.test.mjs` (Node 22.6 or newer).
