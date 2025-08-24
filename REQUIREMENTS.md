# bruh.ae — Requirements (updated for a **male** 2000s aesthetic)

> **Goal:** Keep the playful, fan-page nostalgia of the `sweet-pea` reference but shift the visual personality to a more “masculine-leaning” — less sugary florals, more retro-tech / park-bench / vintage-cassette motifs — while remaining clean, responsive, and authentic to early-2000s personal pages. Use only HTML/CSS/vanilla JS where possible.

---

## Core vision

* A modern parody of early-2000s personal/fan pages that reads as a *male* counterpart: nostalgic, slightly rugged, warm-toned, and low-fi-charm rather than pastel-sweet.
* Clean, polished, and responsive — intentionally retro but fully usable on modern devices.
* Minimal dependencies: static HTML/CSS/vanilla JS; small progressive enhancements only.

---

## Palette (design tokens)

Use the supplied palette as the single source of truth. Map roles to colors for consistent theming.

```css
:root{
  --color-1: #ccd5ae; /* primary background / soft olive */
  --color-2: #e9edc9; /* secondary background / paper */
  --color-3: #fefae0; /* panels / cards (cream) */
  --color-4: #faedcd; /* highlights / hover / warm peach */
  --color-5: #d4a373; /* accent / buttons / links (warm tan) */

  /* derived */
  --text-dark: #3f3326; /* recommended readable text (derived darker brown) */
  --muted: rgba(63,51,38,0.6);
  --max-width: 980px;
  --mobile-break: 820px;
}
```

**Notes:**

* Text should use a high-contrast derived color (like `--text-dark`) for readability — derive from the palette but ensure WCAG contrast.
* Use `--color-1` for the site tile background (repeating subtle pattern), `--color-3` for main panels, `--color-5` for primary CTAs and link accents, `--color-4` for micro interactions and glows.

---

## Pages & structure

* Primary pages: `index.html`, `about.html`, `projects/index.html`, `blog/index.html`, `guestbook.html`.
* Static-first: simple includes (SSI) or a tiny build script to assemble header/footer. Keep output as plain HTML.

**File structure suggestion:**

```
/ (root)
  index.html
  about.html
  /projects/index.html
  /blog/index.html
  guestbook.html
  /assets/
    /2000s/          (curated gifs, icons, textures)
    /patterns/       (small repeat PNG/GIF textures)
    /icons/          (inline SVGs, pixel icons)
    main.css
    main.js
```

---

## Navigation & layout

* Classic horizontal top nav, sticky on scroll. Subtle sweep/underline on hover.
* Desktop: centered content with `max-width: var(--max-width)`. Mobile: collapsible menu (vanilla JS) with large tap targets (\~44px).
* Layout: two-column main layout allowed on wide screens (content + narrow sidebar with guestbook/links), but single column on mobile.
* Repeated sections: header and footer as simple includes or small template fragments.

---

## Theme & visual style (male 2000s interpretation)

* **Background:** soft olive/paper tile using `--color-1` with a small repeating texture (grain or subtle diagonal weave) — noticeable but unobtrusive.
* **Panels:** cream cards (`--color-3`) with thin warm borders (use 1px `--color-5`), soft rounded corners and light inner bevels for a slightly embossed look.
* **Accents:** warm tan (`--color-5`) for links, buttons, and counters; peach (`--color-4`) for hover highlights and callouts.
* **Typography:**

  * Body: a clean sans (e.g., `Trebuchet MS`, `Verdana`, `system-ui`) or a neutral Google font with good readability.
  * Headings / accents: consider a pixel/mono header for retro flair (e.g., small heading with a slightly condensed font or a slab-serif for a rugged feel).
  * Avoid overly 'cute' script fonts — lean utilitarian or slightly gritty.
* **Imagery & iconography:**

  * Replace floral/garden motifs with retro items: cassette tapes, pixel binoculars, low-res camera scans, 2000s band tees, skate/park textures, disposable-camera borders, worn paper textures.
  * Use small animated GIFs sparingly (e.g., blinking pixel star, cassette rotating) placed as decorative accents, not dominant elements.
  * Favor inline SVGs for crisp low-weight icons (mail, link, RSS, guestbook).

---

## 2000s-era assets & touches (male spin)

* Curated assets folder `assets/2000s/` with:

  * pixel icons (16–32px), cassette/guitar/boots GIFs, “under construction” badge reimagined (e.g., “building the playlist”).
  * textured borders (scanline, paper grain), diagonal stripe PNGs.
* Nostalgic widgets (optional): small hit counter, site visits badge, guestbook preview, playlist embed (link-only).
* Decorative retro elements: boxed “links” list with small 1–2px separators, badge/“webrings” style footer.

---

## Animations & interactivity

* Keep it light and era-appropriate:

  * Marquee-like behavior: use CSS animation or a tiny JS polyfill; avoid the deprecated `<marquee>` element.
  * Button shine: subtle CSS gradient move on hover.
  * Nav sweep underline: transform-based animated underline on hover.
  * Guestbook: progressive enhancement — serverless endpoint optional; fallback to mailto or static instructions if JS disabled.
* Prefer CSS transitions and minimal JS for toggles, guestbook submission, and mobile nav.

---

## Content & reusable pieces

* Headers, footers, navigation, and sidebar as include fragments or template parts to update site-wide items easily.
* Semantic markup: use `<main>`, `<nav>`, `<header>`, `<footer>`, accessible ARIA attributes for the mobile menu.
* Blog: static list pages with excerpts; each post as its own HTML file or markdown-to-static build output.

---

## Accessibility & usability

* Focus-visible styles (distinct focus ring using `--color-4` or a contrasting outline).
* High contrast for body text; test with derived `--text-dark`.
* Tap targets ≥ 44px when interactive.
* Text resize-friendly: avoid fixed px font sizes for body text.
* Content must be navigable with JS disabled: links, posts, and navigation must work without JS.

---

## Technical guidance

* Stack: static HTML + CSS + vanilla JS. Keep all JS non-blocking and unobtrusive.
* Assets: optimize GIFs/PNGs (small frames, low color counts). Favor SVGs where possible.
* Progressive enhancement: site fully usable without JS; JS adds niceties (menu, marquee polyfill, guestbook POST).
* Avoid large frameworks (no React/Next) in main deliverable; optionally maintain a separate modern branch for experimentation.

---

## Performance & maintainability

* Small assets, compressed and cached.
* Single central CSS file with theme tokens and documented variables.
* Document where to change site-wide items: nav, footer, colors, and favicon.

---

## Nice-to-haves / follow-ups

* `assets/2000s/` starter pack (25–40 curated small GIFs/icons + patterns).
* Sample CSS variables file and a single shared header include.
* Optional: small static JSON file with guestbook entries for previewing without a backend.

---

## Acceptance criteria (updated)

1. The site uses the provided palette consistently (`#ccd5ae`, `#e9edc9`, `#fefae0`, `#faedcd`, `#d4a373`) — background, panels, accents, and hover states are mapped to these tokens.
2. Visual personality clearly reads as the male reinterpretation of the `sweet-pea` vibe: retro-cassette / park-bench / low-fi tech rather than floral/pastel — conveyed through imagery, icons, and textures.
3. Top nav is sticky, accessible, and shows a subtle sweep/underline on hover/active; mobile nav is a collapsible vanilla-JS menu with large tap targets.
4. Pages load as static HTML (no frameworks), with small vanilla JS only for progressive features (mobile menu, marquee polyfill, guestbook).
5. Background uses a subtle repeating texture based on `--color-1` so the tile is noticeable but not overpowering.
6. Panels use `--color-3`, thin borders in `--color-5`, and `--color-4` for interaction highlights.
7. 2000s-era assets (GIFs, pixel icons, patterns) are included and used tastefully across the site.
8. Site degrades gracefully when JS is disabled; accessibility checks (focus states, readable contrast) are satisfied.

---

## Implementation checklist (developer handoff)

* [ ] Create `main.css` with token block and example component styles (nav, panels, buttons).
* [ ] Add repeating background tile `assets/patterns/bg-tile.png` using `--color-1`.
* [ ] Curate `assets/2000s/` with 25 small assets (pixel icons, cassette GIF, paper grain).
* [ ] Build header/footer includes and wire them into pages.
* [ ] Implement vanilla JS for mobile menu and marquee polyfill (non-blocking).
* [ ] Add guestbook preview feed (static JSON fallback + optional serverless POST).
* [ ] Run accessibility contrast tests and mobile tap target checks.
