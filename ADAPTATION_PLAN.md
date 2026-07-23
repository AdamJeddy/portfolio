# Aino Agency → Portfolio Adaptation Plan

**Date:** 2026-07-10
**Status:** Planning phase
**Context:** Merging techniques from [aino.agency](https://aino.agency/) into the existing portfolio at `d:\Code\GitHub\portfolio`

---

## 0. Current State Assessment

### What Exists Today

```
Current architecture:
┌──────────────────────────────────────────────────┐
│  Every page = <TextCanvas> only                  │
│  ┌────────────────────────────────────────────┐  │
│  │  Fixed viewport, monospace character grid  │  │
│  │  Filler words + scattered highlight links  │  │
│  │  No navigation bar, no footer, no layout   │  │
│  │  Dark-only, brutalist, glitch effects      │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

| What Works | What's Missing |
|---|---|
| TextCanvas component with filler words, highlight links, glitch animation | Navigation bar — users must click canvas links to move |
| Next.js App Router, TypeScript, Tailwind CSS | Content readability — all pages are text-noise canvases |
| Data layer (projects.ts, posts.ts) with typed interfaces | Visual hierarchy — no sections, columns, or content layout |
| `generateStaticParams` for SSG | Image/video support — pure text only |
| BrutalButton component | Mode system — one visual style only |
| Google Fonts (Oswald, Space Grotesk) | Footer, live elements, settings/preferences |

### The Core Tension

Your current site is **pure text-canvas** — every page is a fixed viewport of scrolling monospace noise. Aino's site uses the text-canvas as a **design layer** on top of real readable content. The adaptation needs to bridge these two approaches without losing what makes your site distinctive.

---

## 1. Adaptation Strategy: The Layer Model

### Concept

Instead of making every page a text canvas, adopt Aino's **layered approach**:

```
┌───────────────────────────────────────────────┐
│  LAYER 3: Navigation (fixed)                  │
│  ┌───────────────────────────────────────────┐│
│  │  [Logo]  Work  Writing  About  [⚙] [✉]   ││
│  └───────────────────────────────────────────┘│
│                                               │
│  LAYER 2: Text Canvas (background/fixed)      │
│  ┌───────────────────────────────────────────┐│
│  │  ASCII art / filler text / character grid ││
│  │  (visible in "Text" mode, hidden in       ││
│  │   "Image" mode, transparent overlay)      ││
│  └───────────────────────────────────────────┘│
│                                               │
│  LAYER 1: Content (scrollable)                │
│  ┌───────────────────────────────────────────┐│
│  │  ┌────────┐  ┌─────────────┐              ││
│  │  │ Project│  │   Writing   │              ││
│  │  │  Card  │  │   Preview   │              ││
│  │  └────────┘  └─────────────┘              ││
│  │  Sections, images, text, actual content   ││
│  └───────────────────────────────────────────┘│
│                                               │
│  LAYER 0: Footer                              │
│  ┌───────────────────────────────────────────┐│
│  │  Links · Live Clock · Social              ││
│  └───────────────────────────────────────────┘│
└───────────────────────────────────────────────┘
```

### Mode System

| Mode | Text Canvas | Content | Navigation | Footer | Feeling |
|---|---|---|---|---|---|
| **Image** (default) | Hidden | Visible, readable | Visible | Visible | Traditional portfolio |
| **Text** | Visible, covers viewport | Hidden behind canvas | Visible | Visible | Terminal/brutalist |
| **Image + Overlay** | Semi-transparent overlay | Visible underneath | Visible | Visible | Mixed/augmented |

This gives you the best of both worlds — the text-canvas aesthetic as a **signature feature** (togglable), and real content that actually communicates your work.

---

## 2. What to Keep, What to Evolve

### Keep (Already Working Well)

| Asset | Why Keep It |
|---|---|
| `TextCanvas.tsx` | Core distinctive component — becomes a background/system layer |
| `BrutalButton.tsx` | Clean button component, can be styled into Aino-style monospace buttons |
| `projects.ts` / `posts.ts` | Solid typed data layer, extend with richer content |
| `generateStaticParams` | SSG pattern, works great, keep it |
| Glitch animation | Signature effect, keep on name/brand |
| Next.js App Router | Foundation is solid |
| Tailwind CSS | Good for utility classes, augment with CSS vars |

### Evolve (Adapt to Aino Style)

| Current | → | Target |
|---|---|---|
| Oswald + Space Grotesk | → | Add Geist Mono for the grid system (or keep Space Grotesk + add a true monospace) |
| `globals.css` — ad-hoc tokens | → | CSS custom property grid system (`--ch`, `--line`, `--char`, `--s1`–`--s8`) |
| TextCanvas as page content | → | TextCanvas as a background layer / mode overlay |
| No navigation | → | Fixed top nav with blinking active state |
| No content layout | → | Section + Column grid layout system |
| Dark-only | → | Dark/Light toggle via CSS custom properties |
| No images | → | Image containers with ASCII overlay capability |
| No footer | → | Footer with live clock, links, and location |
| `body { overflow: hidden }` | → | Content pages scroll, homepage can keep the fixed-canvas feel |
| No scroll reveals | → | Fade-in and slide-up on content sections |

---

## 3. Implementation Plan

### Phase 1 — Grid System Foundation (Days 1–3)

**Goal:** Establish the monospace measurement system so everything else snaps to it.

#### 1.1 CSS Custom Properties Grid

Add to `globals.css`:

```css
:root {
  /* Computed dynamically by GridProvider */
  --ch: 7.8;
  --line: 15.6;
  --font-size: 12.1;
  --letter-spacing: 0.12;
  --col: 12;

  /* Derived tokens */
  --char: calc(var(--ch) * 1px);
  --char2: calc(var(--char) * 2);
  --line-px: calc(var(--line) * 1px);

  /* Colors — your existing palette, made swappable */
  --black-rgb: 0, 0, 0;
  --white-rgb: 255, 255, 255;
  --black: rgb(var(--black-rgb));
  --white: rgb(var(--white-rgb));
  --accent: #ff1d1d;
  --dim: #b4b4b4;
}

html.light {
  --black-rgb: 245, 245, 240;
  --white-rgb: 24, 24, 24;
}

html.textmode .content-layer { display: none; }
html.textmode .canvas-layer { display: flex; }
html:not(.textmode) .canvas-layer { pointer-events: none; opacity: 0.12; }
```

#### 1.2 GridProvider Component

New file: `src/components/grid/GridProvider.tsx`

```typescript
'use client'

import { useEffect } from 'react'

export default function GridProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const mobile = w < 769
      const ch = mobile ? 8 : 7.5

      // Simplified from Aino's approach
      const cols = Math.round(w / ch)
      const lineHeight = Math.round(ch * 2)
      const fontSize = Math.round(ch / 0.6 - 0.9)
      const letterSpacing = (0.6 * (ch / 0.6 - fontSize)).toFixed(2)

      // Strip calculation (8-column grid)
      const gutterCols = Math.ceil((Math.round(w / ch) - 18) / 8)
      const strips: Record<string, number> = {}
      for (let i = 0; i < 8; i++) {
        strips[`--strip-${i + 1}`] = gutterCols + i * (gutterCols + 2)
      }

      const style: Record<string, string> = {
        '--ch': String(ch),
        '--cols': String(cols),
        '--col': String(gutterCols * 2 + 2),
        '--rows': String(Math.floor(h / (2 * ch))),
        '--font-size': `${fontSize}px`,
        '--line': `${lineHeight}px`,
        '--line-height': `${lineHeight}px`,
        '--letter-spacing': `${letterSpacing}px`,
        ...strips,
      }

      Object.entries(style).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v)
      })
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  return <>{children}</>
}
```

#### 1.3 Wire GridProvider into Root Layout

Modify `src/app/layout.tsx`:

```typescript
// Add to the body
<body>
  <GridProvider>
    {children}
  </GridProvider>
</body>
```

**Verification:** Open the browser console. `getComputedStyle(document.documentElement).getPropertyValue('--ch')` returns a number. Resize the window — all values update.

---

### Phase 2 — Navigation & Chrome (Days 3–5)

**Goal:** Users can navigate without relying on the text canvas links.

#### 2.1 Nav Component

New file: `src/components/layout/Nav.tsx`

**Features from Aino to incorporate:**
- Fixed top, full width, CSS Grid 4-column layout
- Monospace uppercase text
- Active page: **blinking cursor** animation (your existing glitch could work here too)
- `rel="prefetch"` on links for instant navigation
- Mobile: hamburger menu that expands into full-screen overlay
- Settings gear icon → opens SettingsDialog

**Blinking active state CSS:**
```css
.nav-link.active {
  animation: blink 0.16s steps(1) infinite;
}
@keyframes blink {
  0%, 49% { opacity: 0; }
  50%, 100% { opacity: 1; }
}
```

#### 2.2 Footer Component

New file: `src/components/layout/Footer.tsx`

**Features from Aino to incorporate:**
- Live clock showing current time and date
- Location indicator (e.g., "LONDON FRIDAY 21:50:26")
- Social links (LinkedIn, GitHub)
- Minimal, monospace, no decoration

```typescript
'use client'
// useLiveClock hook — updates every second
// Shows: "LONDON · FRIDAY 21:50:26"
```

#### 2.3 Settings Dialog

New file: `src/components/layout/SettingsDialog.tsx`

**Features from Aino to incorporate:**
- Native `<dialog>` element, slides from right (desktop) or bottom (mobile)
- Three sections:

| Setting | Options | Effect |
|---|---|---|
| **Mood** | Dark / Light | Swaps `--black-rgb` ↔ `--white-rgb` via CSS |
| **Mode** | Image / Text / Overlay | Toggles `html.textmode` class, controls canvas opacity |
| **Grid** | Off / On | Shows a debugging character grid overlay (developer feature) |

- Persists to `localStorage`
- Reads preferences on load

---

### Phase 3 — Content Layer (Days 5–10)

**Goal:** Pages show real, readable content in a structured layout.

#### 3.1 Layout Primitives

These replace the current "every page is a TextCanvas" approach:

| Component | Maps to Aino | Purpose |
|---|---|---|
| `Section` | `.section` | Horizontal flex row, spacing via `--line` × N |
| `Col` | `.col .w1`–`.w8` | Width-constrained column using strip widths |
| `LineList` | `.linelist` | Full-width bordered list with hover highlight |
| `MegaText` | `p.mega` | Large display typography (3× base, weight 720) |

#### 3.2 Homepage (`/`)

**Current:** TextCanvas only — filler text with "by Adam" glitch highlight.

**Target:** Keep the TextCanvas as a background layer. Add scrollable content on top.

```
Homepage structure:
┌──────────────────────────────────────────┐
│  Canvas Layer (fixed background)         │
│  ┌──────────────────────────────────────┐│
│  │  ASCII art of your name/monogram     ││
│  │  generated from profile image        ││
│  │  Fills viewport, fades on scroll     ││
│  └──────────────────────────────────────┘│
│                                          │
│  Content Layer (scrolls over canvas)     │
│  ┌──────────────────────────────────────┐│
│  │  Section: "Adam — Software Engineer" ││
│  │  Section: Featured Projects (2-3)    ││
│  │  Section: Latest Writing (2-3)       ││
│  │  Section: Quick Bio                  ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

**How the TextCanvas evolves:**
- The filler words + glitch name become the **background canvas**
- The highlight links (`PROJECTS`, `WRITING`, `THE PERSON`) move to the **Nav**
- The canvas is full-viewport, fixed position, fades slightly as you scroll

#### 3.3 Projects Index (`/projects`)

**Current:** TextCanvas with project titles as highlight links.

**Target:** Aino-style project grid with grayscale hover.

```
Projects page structure:
┌──────────────────────────────────────────┐
│  Canvas Layer (optional, subtle)         │
│  ┌──────────────────────────────────────┐│
│  │  Faint character grid as texture     ││
│  └──────────────────────────────────────┘│
│                                          │
│  Content Layer                           │
│  ┌──────────────────────────────────────┐│
│  │  MegaText: "Selected Work"           ││
│  │                                      ││
│  │  Project Grid (2 columns)            ││
│  │  ┌──────────┐  ┌──────────┐         ││
│  │  │ [Image]  │  │ [Image]  │         ││
│  │  │ A001     │  │ A002     │         ││
│  │  │ Title    │  │ Title    │         ││
│  │  │ opacity: │  │ opacity: │         ││
│  │  │ 0.3,     │  │ 0.3,     │         ││
│  │  │ gray     │  │ gray     │         ││
│  │  └──────────┘  └──────────┘         ││
│  │  (hover → full color, show info)     ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

**Key interaction:** Projects default to `opacity: 0.3` + `filter: grayscale()`. Hover restores full color. The project info (title, tech stack, year) appears on hover. This is a direct adaptation of Aino's `/work` grid.

**What you need to add:** An image field to `ProjectItem` in `projects.ts`:
```typescript
export interface ProjectItem {
  slug: string
  title: string
  description: string
  tech: string[]
  github: string
  live?: string
  image?: string        // NEW — path to project preview image
  year?: number         // NEW — for the A001-style numbering
  words: string[]
}
```

#### 3.4 Project Detail (`/projects/[slug]`)

**Current:** TextCanvas with title, description, and tech stack as highlights.

**Target:** Aino-style case study page with sections, images, and readable body text.

```
Project detail structure:
┌──────────────────────────────────────────┐
│  Section: A001 / Project Title            │
│  Section: [Hero image or video]           │
│  Section: Description (body text)         │
│  Section: Tech stack (tags)              │
│  Section: [Screenshot / demo image]       │
│  Section: More detail text               │
│  Section: Links (GitHub, Live)           │
│  LineList: Other projects (prev/next)    │
└──────────────────────────────────────────┘
```

**What you need to add:** A `content` or `body` field to `ProjectItem` for longer-form text, plus optional additional images.

#### 3.5 Writing Index & Detail (`/content`, `/content/[slug]`)

**Decision:** Keep excerpt-only text canvas (Option B).

Writing pages retain the current TextCanvas-only approach — the signature aesthetic works best for the writing section. The TextCanvas on these pages uses domain-relevant filler words and shows post excerpts in the center zone. This keeps writing as a distinct, terminal-like experience separate from the project pages.

**Index page:** LineList or TextCanvas with post titles as highlight links.
**Detail page:** TextCanvas with title as glitch highlight + excerpt in lower zone.

#### 3.6 About (`/the-person`)

**Current:** TextCanvas with name, role, and skill keywords.

**Target:** Structured about page with:
- MegaText intro statement
- Bio section (readable paragraphs)
- Skills/technologies as tags
- Timeline or LineList of experience
- Contact link

---

### Phase 3.5 — Play Section (Days 10–13)

**Decision:** Add interactive terminal/ASCII experiments (Option A).

#### 3.5.1 Play Hub (`/play`)

Aino-style game hub rendered as a terminal/ASCII interface:

```
PLAY                    ● TEXTRIS               HIGHSCORES
                        ○ SNEKST                
                        ○ PAKKU                 1.  AAA   215673
                                                2.  BBB   94380
                        ARROWS TO SELECT        3.  CCC   56011
                        ENTER TO PLAY
```

**Implementation approach:** Render the hub as a pre-formatted ASCII layout using the monospace grid. Each game is a text-based game rendered in a fixed character grid.

**Games to implement (at least one for launch):**

| Game | Description | Complexity |
|---|---|---|
| **Textris** | Tetris clone using Unicode block characters (`█▀▄■□▪▫`) | Medium — rotation matrices, collision detection, line clearing |
| Snekst (stretch) | Snake clone using ASCII characters | Low — directional movement, growth, self-collision |
| Pakku (stretch) | Pac-Man clone in ASCII | High — maze generation, ghost AI |

**Tech approach:** Canvas-free — render games as pre-formatted `<pre>` text blocks updated via `requestAnimationFrame`. Each game gets its own route: `/play/textris`, `/play/snekst`, `/play/pakku`.

**High scores:** Store in `localStorage`. Display on the hub page. Simple three-letter name entry.

---

### Phase 4 — Image & ASCII Pipeline (Days 8–12)

**Goal:** Images work in "Image" mode. ASCII art overlays appear in "Text" mode.

#### 4.1 ImageWithAscii Component

New file: `src/components/media/ImageWithAscii.tsx`

```typescript
'use client'
// Accepts: src, alt, width, height, asciiChars (optional custom charset)
// Renders:
//   <div class="image-container">
//     <img src={...} />          ← hidden in text mode
//     <canvas ref={canvasRef} /> ← hidden in image mode, shows ASCII
//   </div>
// Uses Canvas2D to:
//   1. Draw image at reduced resolution
//   2. Sample pixel brightness via getImageData
//   3. Map brightness to ASCII characters
//   4. Render ASCII text onto canvas
```

**Key implementation detail from Aino:** The canvas uses `image-rendering: pixelated` and is absolutely positioned over the image. Text mode hides the image (`opacity: 0`), image mode hides the canvas.

#### 4.2 ASCII Character Set

Use the Aino character set (or a variant):

```
const densityMap = '.:-=+*#%@'           // Light → Dark
// Aino uses something like: ·:+=<?!3I2549
// You could use: .:;+=xX$&  or any density map
```

Since your site is dark-themed by default, invert: light pixels → dense chars, dark pixels → sparse chars.

#### 4.3 Build-Time vs Runtime

**Recommendation:** Do ASCII conversion at **build time** for known images (project screenshots, profile photo). Reserve **runtime** conversion for dynamic content.

Build-time approach:
1. Use `sharp` (already available in Next.js) to process images during build
2. Generate ASCII art strings, store alongside image metadata
3. Render pre-computed ASCII in the canvas component

This avoids the Canvas2D `getImageData` performance warnings observed on Aino's site.

---

### Phase 5 — Interaction Polish (Days 10–14)

#### 5.1 Scroll Reveals

New file: `src/hooks/useReveal.ts`

```typescript
'use client'
// Uses IntersectionObserver
// Adds 'revealed' class when element enters viewport
// Supports: fade, slide-up, stagger (delayed children)
```

Apply to sections and cards:
```css
[data-reveal="fade"] {
  opacity: 0;
  transition: opacity 0.4s ease-out;
}
[data-reveal="fade"].revealed {
  opacity: 1;
}

[data-reveal="slide-up"] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[data-reveal="slide-up"].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

#### 5.2 Project Grid Hover Effect

```css
.project-grid .project-card {
  opacity: 0.3;
  filter: grayscale(1);
  transition: opacity 0.2s ease-out, filter 0.2s ease-out;
}
.project-grid:hover .project-card {
  opacity: 1;
  filter: grayscale(0);
}
.project-grid .project-card:hover {
  opacity: 1;
  filter: grayscale(0);
}
.project-grid .project-card .info {
  opacity: 0;
  transition: opacity 0.2s ease-out;
}
.project-grid .project-card:hover .info {
  opacity: 1;
}
```

#### 5.3 Line List (for writing index, project links)

```css
.linelist li .line {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--char2);
  width: 100vw;
  margin-left: calc(var(--char) * -2);
  padding: 0 var(--char2);
  border-top: 1px solid rgba(var(--white-rgb), 0.1);
}

@media (hover: hover) {
  .linelist li a:hover {
    background: var(--white);
    color: var(--black);
  }
}
```

#### 5.4 Page Transitions

Keep it subtle — Aino doesn't animate page transitions. Consider a quick fade:

```css
/* In layout.tsx, wrap children in an animated div */
.page-transition {
  animation: pageIn 0.15s ease-out;
}
@keyframes pageIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

### Phase 6 — Pre-Launch (Days 14–16)

#### 6.1 Accessibility Pass

- All images have `alt` text (already true)
- Canvas has `aria-label` describing the ASCII art
- Text mode provides a way to switch back to image mode
- Keyboard navigation through project grid
- Focus visible styles on all interactive elements
- `prefers-reduced-motion` respects user preference — disable glitch, blink, scroll reveals

```css
@media (prefers-reduced-motion: reduce) {
  .glitch, .nav-link.active, .blink { animation: none; }
  [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
}
```

#### 6.2 Responsive Testing

- **768px breakpoint** (Aino's mobile threshold)
- Single column below 768px
- Nav collapses to hamburger
- Images go from 50vw to 75vw
- Text canvas uses larger font on mobile (as you already do)

#### 6.3 Build Verification

```bash
npm run build   # Must pass — SSG with generateStaticParams
npm run lint    # Must pass — TypeScript + ESLint
```

---

## 4. Component Dependency Map

```
GridProvider ─────────────────────────────────────────────┐
    │                                                      │
    ├── Nav ────────────── uses ── usePathname (next/nav)  │
    │   └── SettingsDialog ─ uses ── useTheme hook         │
    │                                                      │
    ├── Footer ─────────── uses ── useLiveClock hook       │
    │                                                      │
    ├── Section ────────── uses ── CSS vars (--line, etc.) │
    │   └── Col ────────── uses ── CSS vars (--s1..--s8)  │
    │       ├── MegaText                                  │
    │       ├── ProjectCard ── uses ── ImageWithAscii     │
    │       │   └── ImageWithAscii ── uses ── Canvas2D    │
    │       ├── PostPreview                                │
    │       └── LineList                                   │
    │                                                      │
    ├── TextCanvas (evolved) ─ uses ── Canvas2D           │
    │   └── (homepage background layer)                    │
    │                                                      │
    └── Reveal ──────────── uses ── IntersectionObserver   │
        └── (wraps any content section)                    │
```

---

## 5. Migration Strategy: Incremental, Never Broken

### Rule: The site must build and render at every step.

| Step | What Changes | Risk | Rollback |
|---|---|---|---|
| 1 | Add CSS vars + GridProvider to layout | Low — additive only | Remove provider |
| 2 | Add Nav component, show alongside existing TextCanvas | Low — new component | Remove Nav |
| 3 | Add Footer | Low — new component | Remove Footer |
| 4 | Homepage: add content layer below canvas | Medium — changes homepage | Revert page.tsx |
| 5 | Projects index: replace TextCanvas with ProjectGrid | Medium — changes a page | Revert page.tsx |
| 6 | Project detail: add content sections | Medium — changes a page | Revert [slug]/page.tsx |
| 7 | Writing pages: same pattern as projects | Low — follows same pattern | Revert |
| 8 | About page: replace TextCanvas with sections | Low — simple page | Revert |
| 9 | ImageWithAscii + mode toggle | Medium — new rendering path | Toggle off text mode |
| 10 | Polish: reveals, transitions, a11y | Low — additive | Remove animations |

### Daily Checkpoint

After each step:
```bash
npm run build && npm run lint
```

If it fails, fix before moving on. Never stack changes on a broken build.

---

## 6. What Does NOT Change

| Thing | Why Preserve |
|---|---|
| `TextCanvas.tsx` core algorithm | It works, it's distinctive. Becomes a layer instead of the whole page. |
| `BrutalButton.tsx` | Maps cleanly to Aino-style monospace buttons. |
| Data layer (`projects.ts`, `posts.ts`) | Extend with richer fields, don't rewrite. |
| Glitch animation on name | Signature effect, keep on homepage and about page. |
| `generateStaticParams` pattern | Already correct for SSG. |
| Tailwind `@theme` tokens | Coexist with CSS custom properties. |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GridProvider math breaks on edge-case viewport widths | Medium | Layout collapse | Test at 320px, 375px, 768px, 1024px, 1440px, 2560px |
| Canvas2D performance on mobile | Medium | Janky scrolling | Reduce ASCII resolution on mobile, use build-time pre-computed ASCII |
| Text mode makes content inaccessible | High | Users can't read portfolio | Always show "Switch to Image mode" button in text mode; respect `prefers-reduced-motion` |
| Font loading causes layout shift | Low | Ugly flash | `font-display: swap` already set; Geist Mono can be subset to ASCII range |
| Mode preference persistence bugs | Low | Wrong mode on reload | Test localStorage read/write thoroughly; provide fallback to default |
| Project grid grayscale hides content on mobile | Medium | Users miss projects | On mobile (no hover), show full color by default; grayscale only on desktop |

---

## 8. Success Criteria

After implementation, the site should:

1. **Build and lint cleanly** — `npm run build` and `npm run lint` pass
2. **Navigate via both canvas and nav** — TextCanvas links AND the Nav bar both work
3. **Show real content** — Project detail pages have images, descriptions, tech tags, and links
4. **Toggle modes** — Settings dialog switches between Image and Text modes, persists across pages
5. **Work on mobile** — Single column, hamburger nav, readable text, no horizontal scroll
6. **Feel coherent** — The visual language is consistent across all pages (typography, spacing, color)
7. **Load fast** — SSG with prefetching, optimized images, minimal JS
8. **Be accessible** — Keyboard navigable, screen-reader friendly (at minimum in Image mode)

---

## 9. Decisions (Resolved)

| Decision | Choice | Rationale |
|---|---|---|
| Font strategy | **A — Add Geist Mono for grid, keep Space Grotesk for body** | Keeps existing personality, adds the mono grid system |
| Light mode | **B — Dark-only, mode toggle controls canvas visibility** | Simpler, site is fundamentally dark-themed |
| ASCII art on homepage | **B — ASCII art of name/initials** | Most distinctive, least complex to implement |
| Project images | **A — Add image field now, placeholder gradients as fallback** | Forward-compatible, works without real screenshots yet |
| `/play` section | **A — Add interactive terminal/ASCII experiments** | Distinctive feature; build Textris-style game(s) |
| Writing pages | **B — Keep excerpt-only text canvas** | Maintains the signature aesthetic for the writing section |
