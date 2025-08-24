# bruh.ae — Requirements (updated for 2000s aesthetic)

## Core vision
- A modern parody of early-2000s personal/fan-page aesthetics implemented with simple, classic web tech.
- Clean, polished, and responsive — purposely nostalgic but usable on modern devices.
- Avoid heavy frameworks where possible; prefer plain HTML/CSS/JS so the site feels like an authentic 2000s website.

## Pages and structure
- Pages: Home (index.html), About (about.html), Projects (projects/index.html), Blog (blog/index.html), Guestbook (guestbook.html).
- Content pages may be HTML files or simple templated includes (SSI, or a trivial build step that outputs static HTML).
- If dynamic previews are required (guestbook sign), implement small, progressive-enhancement JS or a lightweight serverless endpoint — keep progressive enhancement in mind.

## Navigation & layout
- Classic horizontal top navigation (no large framework-driven router). Sticky top bar is fine.
- Desktop: horizontal links; Mobile: a simple collapsible menu with large tap targets.
- Center page content using a fixed max-width and auto margins so the site doesn't hug the left edge.
- Use vanilla partial includes for repeated sections (header, footer) or a minimal build script to assemble pages.

## Theme & visual style
- Blueish-white base: soft blue/ice background with patterned tile (subtle repeating pattern) to evoke 2000s backgrounds.
- Panels should feel like 2000s fanpages: rounded glossy buttons, beveled panels, inset highlights, and thin warm borders.
- Use a small palette: blue-white backgrounds, darker navy text, teal or sea-blue accents for links/buttons.
- Use tiled/patterned background images (small PNG/GIF textures) and subtle gradients inside panels.

## 2000s-era assets & touches
- Use icons/images/gifs from the era (small animated GIFs, pixel icons, “Under construction” gifs, web-safe style icons).
- Marquee-like scrolling text or a CSS/JS marquee replacement allowed for nostalgia.
- Hit counter widget (simple JS or image-based counter) and guestbook preview are encouraged.

## Animations & interactivity
- Keep animations light and era-appropriate: marquee, subtle button shine, sweep underline on nav, simple hover/bevel effects.
- Prefer CSS animations and minimal JS for interaction.

## Content & reusable pieces
- Reuse simple HTML includes or a tiny build step to replicate header/footer across pages.
- Keep markup semantic and accessible (headings, lists, landmarks) even if pages are static HTML.

## Accessibility & usability
- Focus-visible styles and sufficient contrast for readability.
- Tap targets sized for mobile (≈44px minimum where appropriate).
- Degrade gracefully if JS is disabled (content still readable and navigable).

## Technical guidance
- Preferred stack: static HTML + CSS + vanilla JS.
- Assets: small GIFs/PNGs; avoid heavy images. Prefer inline SVGs for crisp icons where possible.
- JS for progressive enhancement (mobile menu, marquee polyfill, guestbook submission). No React/Next.js-specific code in the user-facing deliverable unless you want a separate modern branch.

## Non-functional
- Keep it performant: small assets, limited DOM complexity, no heavy runtime.
- Maintainability: keep templates organized and document where to update site-wide items (nav, footer, theme tokens in a single CSS file).

## Nice-to-haves / follow-ups
- Provide a small assets folder `assets/2000s/` with curated GIFs/icons to use.

## Acceptance criteria (updated)
- Blueish-white patterned background is present and noticeable but not overpowering.
- Top nav is sticky, accessible, and shows a subtle sweep/underline on hover/active.
- Pages load without client-side frameworks; small vanilla JS used only for progressive enhancement (mobile menu, marquee, guestbook form handling).
- 2000s-era assets (icons/gifs) are used across the site to reinforce the aesthetic.
- Mobile navigation and tap targets work; content centers with comfortable margins on large screens.