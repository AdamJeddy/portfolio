# Aino Agency — Comprehensive Analysis & Portfolio Implementation Blueprint

**Date:** 2026-07-10
**Analyst:** GitHub Copilot (DeepSeek V4 Pro)
**Target:** https://aino.agency/

---

## 1. Executive Summary

Aino Agency's website is a **custom-built, art-directed digital experience** that blends brutalist typography, ASCII-art aesthetics, and a monospace-grid layout system into a distinctive design language. It is **not** built on a mainstream framework like Next.js, React, or Vue — instead, it uses a **custom vanilla JavaScript SPA architecture** bundled with a Vite-like module bundler, hosted on Vercel with Vercel Blob Storage for assets and Vercel Image Optimization for responsive images.

The site is fundamentally a **text-canvas system**: everything is measured in monospace character units, image containers overlay ASCII-rendered canvases, and the entire layout is computed from a single variable — the character width (`--ch`). This creates a visually arresting experience where navigation, project showcases, and even embedded games coexist in a unified typographic grid.

The key insight for portfolio adaptation: **the monospace grid system, the text-canvas image rendering, and the mode system (dark/light, image/text/pixel) can be extracted as a reusable design system**, decoupled from the agency's specific content.

---

## 2. Investigation Methodology

### Techniques Used
| Method | Purpose |
|---|---|
| Browser page snapshot analysis | DOM structure, navigation, interactive elements |
| Raw HTML source inspection | Framework identification, script/module analysis |
| CSS bundle retrieval and analysis | Styling approach, grid system, typography, animations |
| Network request observation | Asset hosting, CDN patterns, image optimization |
| Console message monitoring | Runtime behavior, Canvas2D usage, warnings |
| Multi-page navigation (/, /work, /services, /about, /play, /work/[slug]) | Site architecture, content patterns |
| JavaScript evaluation | Framework detection, custom elements, CSS custom properties |

### Confidence Levels
- **High confidence:** Technology stack components, hosting, asset pipeline, CSS architecture, grid system
- **Medium confidence:** Exact JS framework (appears custom, possibly petite-vue or vanilla), bundler (consistent with Vite hashed outputs)
- **Low confidence:** Backend/CMS, exact animation library, accessibility compliance details

---

## 3. Verified Findings

### 3.1 Technology Stack

#### Frontend Framework
**Finding:** Custom vanilla JavaScript application. No React, Vue, Angular, Svelte, or Next.js detected.

**Evidence:**
- No `__NEXT_DATA__` JSON blob
- No `__next` root div
- No React devtools hooks (`__REACT_DEVTOOLS_GLOBAL_HOOK__`)
- No Vue `data-v-*` attributes
- No Svelte component markers
- HTML uses `<main id="app">` with `data-component` attributes (custom convention)
- Module entry: `import "/assets/g7e7Q5yc.js"` (single hashed JS bundle)

**Confidence:** High (95%)

#### Bundler
**Finding:** Vite or Vite-compatible bundler producing hashed assets.

**Evidence:**
- JS bundle: `/assets/g7e7Q5yc.js` (hash-prefixed)
- CSS bundles: `/assets/CT9yiByn.css`, `/assets/CjqTykxV.css` (hash-prefixed)
- Font files: `/assets/DaHF6EGU.woff`, `/assets/DGuULq6Q.woff2`, etc. (hash-prefixed)
- `type="module"` script import pattern
- No webpack-specific artifacts found

**Confidence:** Medium (80%) — could also be Rollup, esbuild, or a custom build pipeline.

#### Rendering Approach
**Finding:** Server-Side Rendering (SSR) with client-side hydration and SPA-style navigation.

**Evidence:**
- Full HTML delivered on initial load (not a blank shell)
- `<link rel="prefetch">` on all navigation links
- Body class changes per route (`body.home`, `body.case`, `body.work`, etc.)
- `<main id="app">` container suggests client-side routing
- Content sections use `data-slug` attributes
- `data-reveal`, `data-textreveal` attributes for scroll-triggered animations

**Confidence:** Medium-High (85%)

#### Routing
**Finding:** Custom client-side router with prefetching.

**Evidence:**
- Links use `rel="prefetch"` attribute
- Body class reflects current route
- URL structure: `/`, `/work`, `/work/[slug]`, `/services`, `/services/[slug]`, `/about`, `/play`, `/contact`
- No hash-based routing
- No query parameters for routing
- History API likely used (standard SPA pattern)

#### State Management
**Finding:** Minimal state — localStorage for preferences, DOM for UI state.

**Evidence:**
- `localStorage.getItem("site")` for persisting dark/light mode and image/text/pixel mode
- CSS class toggling on `<html>` element (`dark`, `textmode`, `pixelmode`)
- No observable global state management library
- Dialog state managed via `<dialog>` element with `open` attribute

#### Styling Approach
**Finding:** Custom CSS with an elaborate CSS custom properties system forming a monospace grid.

**Evidence:**
See **Section 6** (Visual Design Analysis) and **Section 7** (Technical Architecture) for full details.

#### Animation Libraries
**Finding:** CSS transitions + custom JavaScript scroll-triggered reveals. No third-party animation library detected.

**Evidence:**
- CSS `transition` properties for color/opacity changes
- `@keyframes blinker` for cursor blink
- `[data-reveal]` with classes `revealed`, `fade`, `slide-up`
- `html.js .fadein { opacity: 0 }` — JS toggles visibility
- No GSAP, Framer Motion, Anime.js, or Motion One detected

#### Fonts
**Finding:** Three custom variable fonts loaded from hashed assets.

| Font | Usage | Format | Weight |
|---|---|---|---|
| `mono` | Monospace (ASCII art, code, nav) | WOFF/WOFF2 | 400 |
| `abc` | Primary sans-serif (headings) | WOFF/WOFF2 | 100–800 |
| `abcplus` | Secondary sans-serif (body, UI) | WOFF/WOFF2 | 100–800 |

#### Hosting & Deployment
**Finding:** Vercel (confirmed).

**Evidence:**
- Vercel Blob Storage: `jptmwnfp3yiatrcf.public.blob.vercel-storage.com`
- Vercel Image Optimization: `/_vercel/image?url=...&w=...&q=...`
- Vercel Analytics: `/_vercel/insights/script.js`
- Vercel-specific `rel="prefetch"` behavior

#### Third-Party Services
| Service | Purpose | Evidence |
|---|---|---|
| Vercel Analytics | Page views, performance | `/_vercel/insights/script.js` |
| Vercel Blob | Asset storage (images, videos) | All media URLs |
| Vercel Image Optimization | Responsive images | `/_vercel/image` URLs with srcset |
| Structured Data | SEO | `application/ld+json` with Organization schema |

**Not detected:** Google Analytics, Facebook Pixel, Hotjar, Intercom, any cookie consent banners.

---

### 3.2 Site Structure

```
aino.agency/
├── /                    Homepage — text-canvas hero + project grid
├── /work                Project index — filterable grid of case studies
├── /work/[slug]         Case study detail (e.g., /work/nudie-jeans)
├── /services            Services overview
├── /services/[slug]     Service detail (e.g., /services/centra, /services/design)
├── /about               Agency information + facts
├── /play                Game hub (Textris, Snekst, Pakku)
├── /play/[game]         Individual game pages
└── /contact             Contact dialog/form
```

---

## 4. Unknowns and Limitations

### Could Not Be Verified

1. **Backend/CMS:** The HTML is pre-rendered, but there is an admin interface visible in CSS (`#admin` styles, `.admin-panel`, `.admin-translation`). Evidence of a custom CMS with section editing, translation management, and media upload. The backend language and database could not be determined.

2. **Exact JavaScript Framework:** The JS bundle `/assets/g7e7Q5yc.js` could not be fetched and analyzed due to CORS restrictions. It may be:
   - Pure vanilla JS with a custom micro-framework
   - Petite-vue or Alpine.js (lightweight reactive libraries)
   - A custom in-house framework
   - HTMX with custom extensions

3. **Build Pipeline Details:** The exact bundler configuration, transpilation settings, and build scripts are server-side only.

4. **Server Architecture:** Whether this uses Vercel Functions, Edge Functions, or static generation could not be confirmed. The presence of `rel="prefetch"` and seemingly dynamic routes suggests SSR with ISR or SSG.

5. **Accessibility Audit:** A full WCAG compliance audit was not performed. The ASCII-art approach raises significant accessibility questions.

6. **Performance Budget:** No Lighthouse or WebPageTest data was collected. Video autoplay failures (`net::ERR_ABORTED`) were observed but may be environment-specific.

### Further Investigation Needed
- Download and analyze the JS bundle to understand the framework
- Run Lighthouse audit on multiple pages
- Test with screen readers for accessibility
- Investigate the admin panel for CMS architecture
- Test on actual mobile devices (not emulated)

---

## 5. UX and Interaction Analysis

### 5.1 Site Structure & Information Architecture

The site uses a **flat, shallow hierarchy** with clear top-level sections:

```
Navigation:  [Aino]  Work  Services  |  About  Play  |  Settings  Contact
```

- Left-aligned logo doubles as home link
- Primary nav items: Work, Services
- Secondary nav items: About, Play
- Utility items: Settings (theme/mode toggle), Contact

### 5.2 Navigation Patterns

**Desktop:**
- Fixed top navigation bar with monospace typography
- CSS Grid-based layout with 4-column structure
- Active page indicated by **blinking cursor animation** on the nav link
- `rel="prefetch"` for instant page transitions

**Mobile (< 768px):**
- Logo remains visible
- "Contact" and "Menu" buttons replace full navigation
- Full-screen mobile overlay with navigation links
- Settings accessible from mobile menu

### 5.3 Page Transitions

- **No animated page transitions observed** — pages swap content instantly
- Content sections animate in with scroll-triggered reveals (`data-reveal`)
- `fadein` class for opacity transitions
- `stagger` class for sequential element reveals

### 5.4 Scrolling Behavior

- **Custom smooth scrolling** — native `scroll-behavior` likely used
- Scrollbar hidden (`scrollbar-width: none`)
- Homepage has a fixed-position text-canvas background that changes as you scroll
- Sections use `margin-top` based on `--line` multiples for vertical rhythm
- Sticky elements within case study pages

### 5.5 Hover Interactions

**Navigation:**
- `hoverchar` class on nav — likely character-by-character hover effects
- Inactive nav items are normal weight

**Project Grid (/work):**
- Items default to `opacity: 0.3` + `filter: grayscale()`
- Hover restores full opacity and color
- Project info text appears on hover
- Group hover: hovering one case removes grayscale from all cases

**Line Lists (case study footers):**
- `linelist` component: rows highlight on hover
- Active item has blinking cursor
- Hover inverts colors (black bg, white text)

### 5.6 Cursor Interactions

- Default cursor is `default` (not `auto`)
- Clickable elements use `cursor: pointer`
- The homepage text-canvas uses `cursor: default` with `pointer-events: none` after loading

### 5.7 Interactive Elements

**Settings Dialog:**
- Slide-out `<dialog>` element from the right side
- Settings: Mood (Dark/Light), Img (Image/Text/Pixel)
- Changes persist to localStorage
- Real-time preview — toggles CSS classes on `<html>`

**Contact Dialog:**
- Also uses `<dialog>` element
- Contains contact form, email, social links
- Split layout with image

**Video Player (Case Studies):**
- Full-screen video modal with backdrop blur
- ASCII canvas overlay in text/pixel modes
- Close button

### 5.8 Micro-Interactions

- **Blinking cursor:** Used for active navigation, time display, and "watch" indicators (CSS `@keyframes blinker`)
- **Live clock:** Footer shows `GBG/OSL FRIDAY 21:50:26` with real-time clock
- **Character grid:** Homepage renders a massive ASCII art logo using a grid of characters
- **Text reveal:** `data-textreveal` attribute for progressive text animation

### 5.9 Loading Experience

- **Initial Load:** Full HTML delivered (SSR), progressively enhanced with JS
- **Image Loading:** Vercel Image Optimization with responsive `srcset`
- **Video:** Autoplay, loop, muted videos for project showcases
- **JS-dependent elements:** Hidden with `html.js` selector until JS initializes (`#nav { opacity: 0 }` → JS sets opacity)

### 5.10 Keyboard Interactions

- Settings dialog closeable via ESC (native `<dialog>` behavior)
- Navigation links are standard `<a>` elements — keyboard accessible
- Games (Textris, Snekst) use arrow keys

### 5.11 Responsive Behavior

**Breakpoint:** 768px (`--mobile`)

**Desktop layout:**
- Multi-column grid with `--s1` through `--s12` column widths
- Horizontal section layout with `gap: var(--char2)`
- Images at 50vw or 25vw widths

**Mobile layout:**
- Single column stack (`flex-direction: column`)
- Full-width images (75vw)
- Reduced margins and padding
- Hidden decorative grid elements
- Simplified navigation (hamburger menu)

### 5.12 Accessibility Considerations

**Positives:**
- Semantic HTML (`<nav>`, `<main>`, `<header>`, `<dialog>`, `<h1>`–`<h3>`)
- `lang="en"` attribute
- Alt text on images
- Keyboard-operable navigation and dialogs

**Concerns:**
- Scrollbar hidden — violates WCAG 2.5.5 (target size) for some users
- ASCII-art text content may not be screen-reader friendly
- Text/pixel modes hide image content — no accessible alternative provided
- Monospace uppercase text may impact readability for dyslexic users
- `user-scalable` not explicitly set (but not restricted either)
- Color contrast in dark mode not verified

---

## 6. Visual Design Analysis

### 6.1 Typography

**Three-font system:**

| Role | Font | Characteristics |
|---|---|---|
| Display/Headings | `abc` | Variable weight (100–800), stylistic set `ss05`, negative letter-spacing |
| Body/UI | `abcplus` | Variable weight, `MONO` axis for proportional-to-mono transition |
| Code/Nav/ASCII | `mono` | Fixed-width, uppercase default |

**Type Scale:**
- Base: `var(--font-size)` (computed from character width)
- `mega`: 3× base, weight 720, line-height 2.4×
- `fat`: 1.6× base, weight 700
- `big`: 1.8× base, weight 700, line-height 1.6×
- Body: 1× base, `MONO` 0.4, weight 500

**Notable:** The `abcplus` font has a `MONO` variable axis — allowing proportional text to smoothly transition to monospace, a key enabler of the text-canvas aesthetic.

### 6.2 Layout System

The layout is a **monospace-character-grid system**. Every measurement derives from `--ch` (character width in pixels).

```
Core Variables:
  --ch          = character pixel width (~7.5–8.8px on desktop)
  --char        = --ch * 1px
  --char2       = --char * 2
  --line        = line height in px
  --col         = column count (based on viewport width ÷ char width)
  --step        = (100vw - --char2) / 4
  --s1..--s12   = strip widths = --strip-{n} * --char
  --fullcol     = (--col + 2) * --char
```

**Grid strips:** The viewport is divided into 8 "strips" (`--strip-1` through `--strip-8`), each with a calculated width. Column widths (`--s1` through `--s8`) are based on these strips.

**Column classes:** `.col.w1` through `.col.w8` map to strip widths `--s1` through `--s8`.

### 6.3 Spacing System

- Vertical rhythm: multiples of `--line`
- Horizontal gaps: `--char2` (2× character width)
- Section margins: `calc(var(--line) * N)` where N is 0–10
- Padding: `var(--line)` and `var(--char2)` consistently

This creates a rigorous **typographic grid** where all spacing aligns with the monospace character grid.

### 6.4 Color System

**CSS Variable-based theming:**

```
Light Mode (default):
  --black-rgb = --dark    = 24, 24, 24     (#181818)
  --white-rgb = --light   = 245, 245, 240   (#F5F5F0)
  --pure-white            = #FFFFFF
  --pure-black            = #000000

Dark Mode (html.dark):
  --pure-white            = #000000
  --pure-black            = #FFFFFF
  --black-rgb             = --light
  --white-rgb             = --dark
```

**Color Usage:**
- Minimal palette — essentially monochrome
- Transparency layers: `rgba(var(--black-rgb), 0.1)`, `0.05`, `0.4`, etc.
- Blend modes: `multiply`, `screen`, `color-dodge`, `color-burn`, `difference`
- Dark mode inverts the palette cleanly via CSS variable swap

### 6.5 Visual Hierarchy

1. **Text-canvas ASCII art** (homepage) — highest visual impact, large scale
2. **Full-bleed project images/videos** — 50vw width, strong visual presence
3. **Mega typography** (`p.mega`) — key messaging statements
4. **Section headings** — uppercase monospace
5. **Body text** — proportional, readable
6. **UI elements** — buttons, links, navigation

### 6.6 Motion Language

**Minimal and purposeful:**
- **Fade-in:** Content reveals on scroll (`opacity` transitions)
- **Color transitions:** 0.1s–0.4s `ease-out` on backgrounds and colors
- **Blinking:** Cursor blink at 0.16s or 0.4s intervals
- **Grayscale:** Project thumbnails transition from grayscale to color (0.2s)
- **No bouncy/spring animations** — movements are subtle
- **No parallax scrolling** detected

### 6.7 Composition Techniques

- **Text-canvas hero:** Large ASCII art rendered in a fixed-viewport canvas
- **Image + text overlay:** ASCII canvas positioned absolutely over images in text/pixel modes
- **Column asymmetry:** `w4` + `w4` (balanced), `w4` + `col` (unbalanced), mixed widths
- **Between justification:** `.section.between` for space-between layouts
- **Sticky positioning:** Case study sidebars

### 6.8 Design Consistency

**High consistency across pages:**
- Same navigation and footer on all pages
- Consistent spacing rhythm
- Same typography scale
- Same color tokens

**Page-specific variations:**
- `body.home` — special text-canvas hero, hidden nav/footer until "ready"
- `body.case` — work detail layout with sticky elements
- `body.play` — game-specific layouts
- `body.work` — filterable grid with grayscale hover

### 6.9 Reusable Design Patterns

| Pattern | Description | CSS Class |
|---|---|---|
| Section | Horizontal flex row with columns | `.section` |
| Column | Width-variable flex column | `.col`, `.w1`–`.w8` |
| Line list | Full-width bordered list with hover | `.linelist` |
| Button | Monospace uppercase pill button | `a.button`, `button` |
| Image container | Canvas overlay for ASCII mode | `.image` |
| Video container | Autoplay video with canvas overlay | `.video` |
| Dialog | Slide-out side panel | `#side-dialog` |
| Mega text | Large display typography | `.mega` |
| Stagger reveal | Sequential element animation | `.stagger` |
| Fade in | Scroll-triggered opacity | `.fadein` |

---

## 7. Technical Architecture Analysis

### 7.1 Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Hosting                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              SSR Server (Node/Edge)               │  │
│  │  - Renders full HTML per route                    │  │
│  │  - Computes grid variables server-side            │  │
│  │  - Injects content from CMS/database              │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │              Client-Side JS (SPA)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │
│  │  │ Router   │  │ Reveal   │  │ TextCanvas       │ │  │
│  │  │ (prefetch│  │ Observer │  │ (ASCII renderer) │ │  │
│  │  │ + hist.) │  │ (IO API) │  │                  │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │
│  │  │ Theme    │  │ Grid     │  │ Game Engine      │ │  │
│  │  │ Manager  │  │ Resizer  │  │ (Textris/Snekst) │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │              Vercel Services                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │
│  │  │ Blob     │  │ Image    │  │ Analytics        │ │  │
│  │  │ Storage  │  │ Optimizer│  │                  │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Rendering Mechanism

The site uses a **hybrid SSR + CSR architecture**:

1. **Server renders** complete HTML for each route (all content is in the initial HTML)
2. **Client hydrates** with a JS module that:
   - Enables SPA navigation (intercepting link clicks, History API)
   - Sets up IntersectionObserver for scroll reveals
   - Initializes the homepage text-canvas
   - Applies theme preferences from localStorage
   - Computes grid CSS variables on resize/orientation change
3. **CSS handles** most visual behavior (dark mode, text mode, pixel mode, responsive layouts)

### 7.3 The Grid System (Core Innovation)

The grid system is the **architectural foundation** of the entire site.

```javascript
// Simplified recreation of the inline grid computation script
function computeGrid() {
  const width = innerWidth;
  const isMobile = width < 769;
  let charWidth = isMobile ? 8 : 7.5;
  
  // Calculate how many characters fit
  let columns = Math.round(width / charWidth);
  let gutterCols = 0;
  let stripCount = 0;
  
  // Specialized calculation for the 8-strip layout
  if (!isMobile) {
    // Adjust for 18px offsets (likely accounting for scrollbar/padding)
    let adjustedWidth = width - 18;
    adjustedWidth -= adjustedWidth % 16;
    charWidth = adjustedWidth / (adjustedWidth / charWidth + 18);
    gutterCols = Math.ceil((width / charWidth - 18) / 8);
    stripCount = 2 * gutterCols + 2;
  } else {
    // Mobile: simpler calculation
    charWidth = width / (width / charWidth - 6);
    // ... mobile-specific adjustments
  }
  
  // Compute strip positions
  const strips = {};
  for (let i = 0; i < 8; i++) {
    strips[`strip-${i + 1}`] = gutterCols + i * (gutterCols + 2);
  }
  
  // Derive all CSS custom properties
  const fontSize = charWidth / 0.6 - 0.9;
  const lineHeight = 2 * charWidth;
  const letterSpacing = 0.6 * (charWidth / 0.6 - fontSize);
  
  document.documentElement.style = `
    --ch: ${charWidth};
    --cols: ${columns};
    --col: ${stripCount};
    --rows: ${Math.floor(innerHeight / (2 * charWidth))};
    --letter-spacing: ${letterSpacing}px;
    --font-size: ${fontSize}px;
    --line-height: ${lineHeight}px;
    --line: ${lineHeight}px;
    --screen-height: ${screen.availHeight};
    --light: 245,245,240;
    --dark: 24,24,24;
    --strip-1: ${strips['strip-1']};
    --strip-2: ${strips['strip-2']};
    --strip-3: ${strips['strip-3']};
    --strip-4: ${strips['strip-4']};
    --strip-5: ${strips['strip-5']};
    --strip-6: ${strips['strip-6']};
    --strip-7: ${strips['strip-7']};
    --strip-8: ${strips['strip-8']};
  `.split(';').map(s => s.trim()).join(';');
}
```

**Key insights:**
- The entire layout is computed from `innerWidth`
- Character width (`--ch`) drives font-size, line-height, letter-spacing, and column widths
- Safari gets special treatment (different font rendering)
- Touch devices use `orientationchange` instead of `resize`

### 7.4 Animation Systems

**System 1: CSS Transitions**
```css
html {
  transition: background-color 0.1s ease-out, color 0.1s ease-out;
}
[data-reveal="fade"] {
  transition: opacity 0.4s;
}
[data-reveal="slide-up"] {
  transition: opacity 0.6s, transform 0.6s;
  transform: translateY(20px);
}
```

**System 2: IntersectionObserver (inferred)**
```javascript
// Pseudocode for scroll-triggered reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
});

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

**System 3: Homepage Text-Canvas**
The homepage renders a large ASCII art composition using `<canvas>` with `getImageData` for pixel manipulation. The text-canvas is fixed-position and changes content based on scroll position or internal state.

### 7.5 Event Handling

| Event | Handler | Purpose |
|---|---|---|
| `resize` / `orientationchange` | `computeGrid()` | Recalculate grid on viewport change |
| `DOMContentLoaded` | Init script | Apply theme, setup grid, enable JS classes |
| `click` (delegated) | Router | Intercept navigation links for SPA behavior |
| `scroll` | IntersectionObserver | Trigger reveal animations |
| `keydown` | Game engines | Arrow key input for games |

### 7.6 Scene Management (Homepage)

The homepage uses a layered approach:
1. **Background layer:** Fixed `.gridcontainer` with the ASCII art canvas
2. **Content layer:** Scrollable `.home-content` with project sections
3. **Navigation layer:** Fixed `#nav` that fades in after initial load

The transition is managed by the `body.home.ready` class:
- Initially: nav hidden, footer hidden, grid is interactive
- After "ready": nav fades in, content scrolls over the grid, grid becomes `pointer-events: none`

### 7.7 Data Flow

```
CMS/Admin Panel (inferred)
    │
    ▼
Server-side data (unknown DB/API)
    │
    ▼
SSR HTML generation
    │
    ▼
Client receives full HTML
    │
    ▼
JS hydrates: router, observers, theme
    │
    ▼
User interactions update DOM directly
    │
    ▼
localStorage persists preferences
```

### 7.8 Performance Techniques

- **Prefetching:** `<link rel="prefetch">` on navigation links
- **Font display swap:** `font-display: swap` on all `@font-face` declarations
- **Responsive images:** `srcset` with multiple widths via Vercel Image Optimization
- **Video autoplay:** `preload="auto"`, `muted`, `loop`, `playsinline`
- **CSS containment:** Not explicitly used, but layout is highly optimized
- **No large JS bundles:** Single module entry point with hashed chunks
- **Scrollbar hidden:** Reduces layout shift

### 7.9 Browser APIs Utilized

| API | Usage |
|---|---|
| Canvas 2D API | Text-canvas rendering, ASCII art generation |
| `getImageData` | Pixel sampling for ASCII conversion |
| IntersectionObserver | Scroll-triggered reveals |
| History API | SPA navigation (inferred) |
| localStorage | Preference persistence |
| `<dialog>` element | Settings and contact modals |
| CSS Custom Properties | Entire grid/layout system |
| `prefers-color-scheme` | System dark mode detection |
| `matchMedia` | Responsive breakpoint detection |
| `requestAnimationFrame` | Canvas animation (inferred) |
| `navigator.userAgent` | Safari detection |

---

## 8. Performance Analysis

### 8.1 Loading Performance

**Observations:**
- Initial HTML is delivered fully rendered (SSR) — good for FCP/LCP
- CSS files are small and inlined in `<head>` via `<link>` — no render-blocking issues beyond normal
- JS is loaded as `type="module"` — deferred by default
- Vercel Analytics script uses `defer`
- Fonts use `font-display: swap` — no invisible text during load

**Concerns:**
- Multiple MP4 video assets loaded on homepage (observed failures may be environment-specific)
- Vercel Blob Storage videos are large (~several MB each based on URL patterns)
- No observed lazy loading for off-screen videos

### 8.2 Runtime Performance

**Canvas2D warnings observed:**
```
Canvas2D: Multiple readback operations using getImageData are faster 
with the willReadFrequently attribute set to true.
```
This indicates the text-canvas system uses `getImageData` extensively (for ASCII pixel sampling), but the canvas context was not created with `willReadFrequently: true`. This is a performance optimization opportunity missed.

### 8.3 Network Behavior

**Asset domains:**
- `aino.agency` — HTML, CSS, JS, fonts
- `jptmwnfp3yiatrcf.public.blob.vercel-storage.com` — images, videos
- `aino.agency/_vercel/image` — optimized image proxy

**Image optimization pattern:**
```
Original: https://...blob.vercel-storage.com/nudie-EfpCiKCFxlzQvbMmwruoVhZleMYCvp.jpg
Optimized: /_vercel/image?url=...&w=1920&q=90
Srcset:    ...&w=160, ...&w=320, ...&w=640, ...&w=960, ...&w=1280, ...&w=1600, ...&w=1920, ...&w=2240
```

### 8.4 Asset Sizes (Estimated)

| Asset Type | Estimated Size | Notes |
|---|---|---|
| HTML (initial) | ~50KB | Full page content |
| CSS (total) | ~30KB | Two hashed files |
| JS (module) | Unknown | Could not fetch, likely 20–50KB |
| Fonts (3 families) | ~100–200KB total | WOFF2, variable fonts |
| Images (per project) | 50–200KB | Via Vercel Image Optimization |
| Videos (per project) | 2–8MB | MP4 from Vercel Blob |

### 8.5 Rendering Performance

- Canvas rendering at full viewport size — GPU-accelerated, but could impact battery on mobile
- `image-rendering: pixelated` on canvas overlays — efficient
- CSS transitions on `background-color` and `color` — compositor-only, very performant
- No heavy JavaScript computations observed during idle

### 8.6 Opportunities Observed

1. **Canvas optimization:** Add `willReadFrequently: true` to canvas contexts using `getImageData`
2. **Video lazy loading:** Videos below the fold could use IntersectionObserver-based loading
3. **Font subsetting:** Variable fonts include full character sets — could be subset for Latin-only
4. **CSS inlining:** Critical CSS could be inlined in `<head>` for faster first paint
5. **Image format:** WebP/AVIF not observed — JPEG/PNG used exclusively

---

## 9. Portfolio Adaptation Recommendations

### 9.1 Core Principles to Preserve

1. **Monospace grid foundation:** Build the layout on a character-grid system where all spacing derives from `--ch`
2. **Dual rendering modes:** Support image and text/pixel modes as a distinctive feature
3. **Minimal color palette:** Light/Dark with CSS custom property swapping
4. **Typographic hierarchy:** Variable font with proportional-to-mono axis
5. **Scroll-triggered reveals:** Subtle fade-in animations
6. **ASCII/text-canvas art:** Signature visual element for the homepage/hero
7. **Blinking cursor motif:** Active state indicator
8. **Live elements:** Clock or other real-time data in footer

### 9.2 Concepts to Adapt

| Aino Concept | Portfolio Adaptation |
|---|---|
| Agency brand → ASCII logo | Personal name/monogram → ASCII portrait or name art |
| Project case studies → grayscale grid | Portfolio projects → grayscale grid with hover reveal |
| Services → capabilities list | Skills/technologies → categorized capabilities |
| Play → games | Optional: interactive resume or skills demo |
| About → agency story | About → personal bio, experience, timeline |
| Contact → business inquiry | Contact → freelance/opportunity inquiry |
| Settings → mood/img toggle | Settings → theme/mode toggle |

### 9.3 Content Organization

```
portfolio/
├── /                    Homepage — ASCII portrait + project highlights
├── /projects            Project index — filterable grid
├── /projects/[slug]     Project detail — case study format
├── /writing             Blog/articles index
├── /writing/[slug]      Article detail
├── /about               Bio, experience, skills
├── /contact             Contact form
└── (optional) /play     Interactive experiments
```

### 9.4 Interaction Patterns to Reuse

| Pattern | How to Adapt |
|---|---|
| Grayscale → color hover on project grid | Same for portfolio projects |
| Line list with hover inversion | For project index or writing index |
| Scroll-triggered fade/slide reveals | For all content sections |
| Settings dialog (theme + mode) | Same pattern, portfolio-appropriate labels |
| Fixed nav with blinking active state | For portfolio navigation |
| Footer with live clock | For portfolio footer |
| Text-canvas ASCII art hero | Generate ASCII art from profile photo |

### 9.5 What NOT to Copy

- The exact canvas grid computation (overly complex, can be simplified)
- Agency-specific content structure (services, e-commerce)
- Admin panel (unless building a CMS)
- The exact font files (use similar open-source alternatives)
- The Safari-specific hacks (can use feature detection instead)

---

## 10. Proposed System Architecture

### 10.1 Technology Choices

Given the existing portfolio uses Next.js with React + TypeScript + Tailwind, and the target aesthetic requires a custom monospace grid system, the recommended approach is **a hybrid**:

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Already adopted, SSR/SSG, image optimization |
| Language | **TypeScript** | Type safety, already adopted |
| Styling | **CSS Custom Properties + Tailwind** | Tailwind for utilities, CSS vars for the grid system |
| Animation | **CSS transitions + Framer Motion** | Framer Motion for scroll reveals, CSS for simple transitions |
| Canvas | **Custom React hooks + Canvas2D** | For ASCII art rendering |
| Fonts | **Geist Mono + Geist Sans** (or similar) | Variable fonts with mono axis |
| Hosting | **Vercel** | Already used by the project |
| Content | **MDX or local data files** | Simple, git-based, already used |

### 10.2 System Modules

```
┌─────────────────────────────────────────────────────┐
│                    App Layout                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Nav      │  │ Theme    │  │ GridProvider       │ │
│  │ (fixed)  │  │ Provider │  │ (CSS var compute)  │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐│
│  │              Main Content Area                  ││
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐ ││
│  │  │ TextCan- │  │ Project  │  │ Content        │ ││
│  │  │ vas Hero │  │ Grid     │  │ Sections       │ ││
│  │  └──────────┘  └──────────┘  └────────────────┘ ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │              Footer (live clock, links)         ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 10.3 Proposed Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with GridProvider, ThemeProvider
│   ├── page.tsx                # Homepage with TextCanvas hero
│   ├── globals.css             # CSS custom properties, grid system
│   ├── projects/
│   │   ├── page.tsx            # Project grid
│   │   └── [slug]/page.tsx     # Project detail
│   ├── writing/
│   │   ├── page.tsx            # Writing index
│   │   └── [slug]/page.tsx     # Article detail
│   ├── about/page.tsx          # About page
│   └── contact/page.tsx        # Contact page
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             # Fixed navigation
│   │   ├── Footer.tsx          # Footer with live clock
│   │   └── SettingsDialog.tsx  # Theme/mode toggle
│   ├── grid/
│   │   ├── GridProvider.tsx    # CSS var computation
│   │   ├── Section.tsx         # Grid section container
│   │   ├── Col.tsx             # Grid column
│   │   └── LineList.tsx        # Bordered list component
│   ├── canvas/
│   │   ├── TextCanvas.tsx      # ASCII art renderer
│   │   ├── useTextCanvas.ts    # Canvas hook
│   │   └── asciiConverter.ts   # Image → ASCII conversion
│   ├── media/
│   │   ├── ImageWithAscii.tsx  # Image + ASCII overlay
│   │   └── VideoWithAscii.tsx  # Video + ASCII overlay
│   ├── ui/
│   │   ├── Button.tsx          # Monospace button
│   │   ├── BlinkText.tsx       # Blinking cursor text
│   │   └── Reveal.tsx          # Scroll-triggered reveal
│   └── projects/
│       ├── ProjectCard.tsx     # Grayscale hover card
│       └── ProjectGrid.tsx     # Filterable grid
├── lib/
│   ├── grid.ts                 # Grid computation utilities
│   ├── ascii.ts                # ASCII conversion utilities
│   ├── projects.ts             # Project data (existing)
│   └── posts.ts                # Writing data (existing)
└── hooks/
    ├── useGrid.ts              # Grid resize listener
    ├── useTheme.ts             # Theme/localStorage
    ├── useReveal.ts            # IntersectionObserver
    └── useLiveClock.ts         # Real-time clock
```

### 10.4 CSS Custom Properties System

```css
:root {
  /* Computed by GridProvider */
  --ch: 7.8;                    /* Character width in px */
  --line: 15.6;                 /* Line height (2 * --ch) */
  --font-size: 12.1;            /* Base font size */
  --letter-spacing: 0.12;       /* Letter spacing */
  --col: 12;                    /* Column count */
  --rows: 40;                   /* Row count */
  
  /* Derived */
  --char: calc(var(--ch) * 1px);
  --char2: calc(var(--char) * 2);
  --line-px: calc(var(--line) * 1px);
  --border-radius: calc(var(--char) * 0.4);
  
  /* Strip widths (computed) */
  --s1: calc(var(--strip-1) * var(--char));
  --s2: calc(var(--strip-2) * var(--char));
  /* ... s3 through s8 */
  
  /* Full-width column */
  --fullcol: calc((var(--col) + 2) * var(--char));
  
  /* Colors */
  --black-rgb: 24, 24, 24;
  --white-rgb: 245, 245, 240;
  --black: rgb(var(--black-rgb));
  --white: rgb(var(--white-rgb));
}

/* Dark mode */
html.dark {
  --black-rgb: 245, 245, 240;
  --white-rgb: 24, 24, 24;
}

/* Text mode — hide images, show ASCII */
html.textmode .image img,
html.textmode .video video {
  opacity: 0;
}
html.textmode .image canvas,
html.textmode .video canvas {
  display: block;
}
```

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Week 1–2)

**Goal:** Establish the grid system and core layout.

| Task | Description | Dependencies |
|---|---|---|
| 1.1 | Create `GridProvider` with CSS variable computation | None |
| 1.2 | Implement responsive grid breakpoints (mobile < 768px) | 1.1 |
| 1.3 | Build `Section`, `Col` layout components | 1.1 |
| 1.4 | Set up CSS custom properties system in `globals.css` | 1.1 |
| 1.5 | Implement `ThemeProvider` with dark/light/text/pixel modes | None |
| 1.6 | Build `Nav` component with blinking active state | 1.5 |
| 1.7 | Build `Footer` with live clock | None |
| 1.8 | Create `SettingsDialog` component | 1.5 |

**Verification:** Grid renders correctly at multiple breakpoints. Theme switching works. Navigation is functional.

### Phase 2: Visual System (Week 2–3)

**Goal:** Implement the distinctive visual language.

| Task | Description | Dependencies |
|---|---|---|
| 2.1 | Configure fonts (Geist Mono + Geist Sans as Vercel defaults) | None |
| 2.2 | Build `TextCanvas` component with Canvas2D | None |
| 2.3 | Build `ImageWithAscii` component (image + canvas overlay) | 2.2 |
| 2.4 | Build `VideoWithAscii` component | 2.2 |
| 2.5 | Implement `useReveal` hook (IntersectionObserver) | None |
| 2.6 | Build `Reveal` wrapper component | 2.5 |
| 2.7 | Build `Button`, `BlinkText` UI components | None |
| 2.8 | Build `LineList` component | None |

**Verification:** ASCII rendering works. Text/pixel modes hide images and show ASCII. Scroll reveals animate correctly.

### Phase 3: Content Pages (Week 3–4)

**Goal:** Build out all content pages.

| Task | Description | Dependencies |
|---|---|---|
| 3.1 | Homepage with text-canvas hero + project highlights | 2.2, 2.3 |
| 3.2 | Projects index page with grayscale hover grid | 2.6, 2.7 |
| 3.3 | Project detail page (case study layout) | Phase 2 |
| 3.4 | Writing index page with line list | 2.8 |
| 3.5 | Writing detail page | Phase 2 |
| 3.6 | About page | Phase 2 |
| 3.7 | Contact page | Phase 2 |

**Verification:** All pages render. Navigation between pages works. Content displays correctly.

### Phase 4: Polish (Week 4–5)

**Goal:** Refine interactions, performance, and accessibility.

| Task | Description | Dependencies |
|---|---|---|
| 4.1 | Add page transition animations | Phase 3 |
| 4.2 | Implement `rel="prefetch"` for navigation | Phase 3 |
| 4.3 | Optimize canvas performance (`willReadFrequently`) | 2.2 |
| 4.4 | Add keyboard navigation enhancements | Phase 3 |
| 4.5 | Accessibility audit and fixes | Phase 3 |
| 4.6 | Responsive testing and fixes | Phase 3 |
| 4.7 | Performance testing and optimization | Phase 3 |

**Verification:** `npm run build` passes. `npm run lint` passes. Manual testing on desktop and mobile.

### Phase 5: Launch (Week 5)

| Task | Description |
|---|---|
| 5.1 | Final cross-browser testing |
| 5.2 | Deploy to Vercel |
| 5.3 | Set up custom domain |
| 5.4 | SEO metadata and Open Graph tags |
| 5.5 | Analytics setup |

### Milestone Summary

```
Week 1 ████████░░░░░░░░░░░░ Phase 1: Foundation
Week 2 ████████████░░░░░░░░ Phase 1→2: Foundation→Visual
Week 3 ████████████████░░░░ Phase 2→3: Visual→Content
Week 4 ████████████████████ Phase 3→4: Content→Polish
Week 5 ████████████████████ Phase 4→5: Polish→Launch
```

---

## 12. Risks and Open Questions

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Canvas performance on mobile | Battery drain, slow rendering | Lazy initialize canvas, reduce resolution on mobile, use `willReadFrequently` |
| Accessibility of ASCII-only modes | Screen reader users get no content | Always provide alt text, consider `aria-label` on canvas, keep semantic HTML underneath |
| Font loading delay | Flash of unstyled text | `font-display: swap` already planned; consider subsetting |
| Variable font file size | Slow initial load | Subset to Latin characters only, use WOFF2 |
| Grid computation complexity | Buggy layouts on edge cases | Thorough unit testing of grid math, test many viewport widths |
| Video autoplay restrictions | Videos not playing on mobile/some browsers | Always include `muted`, `playsinline`, `loop`; provide static fallback images |
| dark/light mode CSS variable complexity | Maintenance overhead | Keep variable naming consistent, document the system |

### Open Questions

1. **Font licensing:** The Aino site uses custom fonts (`abc`, `abcplus`, `mono`). For the portfolio, similar open-source variable fonts must be sourced. Geist (Vercel's font) is a natural choice since we're on Vercel.

2. **Content management:** Should the portfolio use MDX files (current approach), a headless CMS, or a database? MDX is simplest and aligns with the existing project.

3. **Game integration:** Should the `/play` section with retro games be included? It's distinctive but adds complexity. Consider it as a Phase 2+ feature.

4. **Admin panel:** Aino has a custom admin panel. For a personal portfolio, git-based content management (MDX files) is more appropriate.

5. **Animation library choice:** Framer Motion adds ~30KB. CSS-only animations are lighter but less capable. The trade-off needs to be evaluated.

6. **Image-to-ASCII conversion:** Should this be done at build time (static) or runtime (dynamic)? Build time is more performant; runtime is more flexible for user-uploaded content.

---

## 13. Appendices

### Appendix A: Key CSS Custom Properties Reference

```css
/* Computed dynamically */
--ch              /* Character width in px (e.g., 7.8) */
--cols            /* Total character columns */
--col             /* Column count for layout */
--rows            /* Total character rows */
--letter-spacing  /* Letter spacing in px */
--font-size       /* Base font size in px */
--line-height     /* Line height in px */
--line            /* Same as line-height, for spacing */
--screen-height   /* screen.availHeight */

/* Derived from computed */
--char            /* calc(var(--ch) * 1px) */
--char2           /* calc(var(--char) * 2) */
--step            /* calc((100vw - var(--char2)) / 4) */
--fullcol         /* calc((var(--col) + 2) * var(--char)) */
--border-radius   /* calc(var(--char) * 0.4) */

/* Strip widths */
--strip-1 through --strip-12
--s1 through --s12  /* calc(var(--strip-N) * var(--char)) */

/* Colors */
--light           /* 245, 245, 240 (RGB) */
--dark            /* 24, 24, 24 (RGB) */
--black-rgb       /* var(--dark) or var(--light) depending on mode */
--white-rgb       /* var(--light) or var(--dark) depending on mode */
--black           /* rgb(var(--black-rgb)) */
--white           /* rgb(var(--white-rgb)) */
--pure-white      /* #fff or #000 depending on mode */
--pure-black      /* #000 or #fff depending on mode */
```

### Appendix B: Observed Class Name Taxonomy

```
Body classes (route):      home, work, case, services, about, play, play-hub,
                           contact, journal, journal-post, login
                           
HTML classes (mode):       dark, textmode, pixelmode, grid, js, light

Layout classes:            section, col, w1-w8, between, center, end, 
                           sticky, solid, border, space, spacesmall, spacebig,
                           hr, hrbottom, first, wrap
                           
Typography:                mega, fat, big, mono, monocaps, caps, 
                           bigbread, stagger, fadein
                           
Components:                linelist, line, hoverchar, image, video, 
                           videoframe, overlay, ascii, gridcontainer,
                           mobile-container, side-dialog, modal
                           
Animation:                 blink, blink-fast, fadein, revealed,
                           slide-up, stagger
                           
States:                    active, hover, open, loading, ready, 
                           inactive, revealed
```

### Appendix C: Observed Script Structure

```html
<!-- 1. Structured Data (SEO) -->
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "Organization", ... }
</script>

<!-- 2. Inline Grid Computation + Theme Init -->
<script type="text/javascript">
  (t => {
    // Theme recovery from localStorage
    const e = localStorage.getItem("site");
    if (e) {
      const n = JSON.parse(e);
      if ("dark" === n?.appearance) t.classList.add("dark");
      if ("text" === n?.mode) t.classList.add("textmode");
      if ("pixel" === n?.mode) t.classList.add("pixelmode");
    }
    t.classList.add("js");
    
    // Safari detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Grid computation function
    const computeGrid = () => { /* ... detailed calculation ... */ };
    computeGrid();
    
    // Resize/orientationchange listener
    const eventType = "ontouchstart" in window ? "orientationchange" : "resize";
    addEventListener(eventType, computeGrid);
    
    // Vercel Analytics init
    window.va = window.va || function() {
      (window.vaq = window.vaq || []).push(arguments);
    };
  })(document.documentElement)
</script>

<!-- 3. Vercel Analytics -->
<script defer src="/_vercel/insights/script.js"></script>

<!-- 4. Main Application Module -->
<script type="module">
  import "/assets/g7e7Q5yc.js"
</script>
```

### Appendix D: Navigation and Route Map

```
┌──────────────────────────────────────────────────────────┐
│  #nav (fixed, grid 4-col)                                │
│  ┌──────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐│
│  │ Aino │ │ Work Services│ │ About Play   │ │ Settings  ││
│  │ (/)  │ │ (/work)      │ │ (/about)     │ │ Contact   ││
│  │      │ │ (/services)  │ │ (/play)      │ │ (/contact)││
│  └──────┘ └──────────────┘ └──────────────┘ └───────────┘│
└──────────────────────────────────────────────────────────┘

Routes:
  /                          → body.home     (text-canvas hero)
  /work                      → body.work     (project grid)
  /work/[slug]               → body.case     (case study)
  /services                  → body.services (services overview)
  /services/[slug]           → body.services (service detail)
  /about                     → body.about    (agency info)
  /play                      → body.play-hub (game hub)
  /play/[game]               → body.play     (individual game)
  /contact                   → body.contact  (contact form)
```

### Appendix E: Visual Mode Comparison

| Mode | CSS Class | Images | Videos | ASCII Canvas | Background |
|---|---|---|---|---|---|
| Image (default) | *(none)* | Visible (`opacity: 1`) | Visible | Hidden | White/Light |
| Text | `html.textmode` | Hidden (`opacity: 0`) | Hidden | Visible | Pure |
| Pixel | `html.pixelmode` | Hidden (`opacity: 0`) | Hidden | Visible (pixelated) | Pure |
| Dark | `html.dark` | Visible (with blend mode adjustments) | Visible | Hidden | Dark/Black |
| Dark + Text | `html.dark.textmode` | Hidden | Hidden | Visible | Dark |

---

*End of Report*
