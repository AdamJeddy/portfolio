# Google SEO Audit — bruh.ae (Adam Ahsan)

**Audited:** 2026-11-01 (Asia/Dubai) · **Source:** `D:\Code\GitHub\portfolio`, branch `feature/agent-link-discovery`, HEAD `d78003fc` (clean tree) · **Deployed:** https://bruh.ae (Cloudflare Pages, static export + `_worker.js` content negotiation)
**Method:** read-only source review; fresh local build in `out/` (regenerated ~11:12–11:32 local, sampled live HTML byte sizes match it — no stale-deploy evidence); live fetch via Node `fetch` (status/headers/body/metadata); measured per-asset Brotli transfer sizes. **No Search Console, GA or CrUX access**; PageSpeed Insights API returned `429 quota exceeded` this session, so no lab/field CWV numbers. Search-engine coverage probes used the tool's generic index (not Google verbatim) and are labelled indicative. Anything not backed by a cited Google/Cloudflare doc or a measurement below is marked as judgement/speculation.

---

## 1. Executive summary

The site is **technically clean and crawlable**: correct canonicals, normalized redirects, valid sitemap, no accidental `noindex`, SSR text content, one `h1` per page. Google can index it today. The gap to the owner's goal ("surface for Adam Ahsan / bruh.ae / bruh / Adam") is **identity and content signal, not crawlability**:

1. **The name "Adam Ahsan" exists exactly once in server-rendered HTML** (homepage `<p>`, `src/app/page.tsx:37`). It is in **no** `<title>`, meta description, JSON-LD, heading or image alt on any route. Site brand is `Adam's Portfolio`; titles say "Adam". With other people named Adam Ahsan on the web, Google has almost no on-site evidence tying the site to the full name.
2. **No `Person` / `ProfilePage` structured data and no author entity graph.** Only a bare `WebSite` on `/` and a weak `Article` block per post (`author.name: "Adam"`, no `url`/`@id`/`image`). `/about`, `/projects`, `/writing` index and `/contact` have no JSON-LD at all.
3. **Core Web Vitals risk concentrated on the best project page:** `/projects/layla-ai` preloads a **2,000,931-byte PNG** as LCP hero and ships **9.64 MB** of images across 13 tags; every page preloads **5 fonts / 141,044 bytes**. These are the highest-leverage performance fixes.

Secondary but important: live `robots.txt` is **not the repo's output** (Cloudflare managed content is prepended, `Content-Signal: search=yes,ai-train=no,use=reference`, blocking ~30 AI crawlers) — a dashboard config drift that must be reconciled with source and the AI-visibility goal; Google Search itself is unaffected (Googlebot is allowed).

### Current-state scorecard

| Axis | Grade | One-line verdict |
|---|---|---|
| Indexability & crawl | **A−** | Canonicals, redirects, sitemap, 404/noindex handling all correct; gaps are sitemap `<lastmod>`, favicon format, RSC `.txt` clutter |
| Metadata (titles/descriptions/OG) | **B−** | Unique titles/descriptions/canonicals everywhere, but no full name, no page contains "Adam Ahsan", default OG image on all 13 routes, article titles 68–70 chars |
| Structured data | **D+** | `WebSite` (homepage) + weak `Article` (posts); missing Person/ProfilePage/BreadcrumbList/SoftwareApplication, no `@id` graph |
| Performance / CWV | **C−** | 141 KB font preloads on every page, 2 MB LCP PNG on Layla, 9.64 MB page images, unoptimized static-export `<img>`; homepage JS ~143 KB Brotli; no field data to confirm |
| Content / E-E-A-T | **C** | Real, substantive essays + case studies (good); About page thin on credentials, author byline "By Adam", no sameAs profile links, homepage text only 813 chars |
| Entity / brand readiness | **D** | Full name barely present; brand term "bruh.ae" never appears in visible text; external profiles inconsistent |
| **Overall (Google readiness)** | **C+** | Indexable and deployable; not yet optimised for name/brand queries |

---

## 2. Live deployment vs local source

### 2.1 Verified correct (live, 2026-11-01)

| Check | Result |
|---|---|
| `http://bruh.ae/` | `301 → https://bruh.ae/` |
| `https://www.bruh.ae/`, `http://www.bruh.ae/` | `301 → https://bruh.ae/` |
| `/about/`, `/about.html`, `/projects/`, `/contact/`, `/writing/`, `/projects/qeemat/`, article `.html` | `308 → extensionless canonical` (single hop; matches Cloudflare Pages HTML→extensionless redirect behaviour, [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)) |
| All sitemap routes | `200`; sitemap 10 URLs, `application/xml` |
| Unknown path | `404` status + HTML 404 page, `robots: noindex`, no canonical |
| `/track-my-salah-privacy-policy` | `200`, `<meta name="robots" content="noindex, follow">`; correctly absent from sitemap |
| Canonicals | Absolute, self-referencing on every indexable route (`https://bruh.ae`, `/about`, `/projects/qeemat`, `/writing/quiet-death-saas-pricing-power`, …) |
| `robots.txt` | `200`; repo lines `User-Agent: * / Allow: / / Sitemap: https://bruh.ae/sitemap.xml` present **after** Cloudflare block |
| HTML caching | `cache-control: public, max-age=0, must-revalidate`, ETag, Brotli; Pages default ([docs](https://developers.cloudflare.com/pages/configuration/serving-pages/)) |
| `Vary` | `Accept, accept-encoding` (worker adds `Accept` for markdown negotiation — does not affect Googlebot) |
| `/site-description.jsonld` | `200 application/ld+json`; homepage `Link: </site-description.jsonld>; rel="describedby"` |
| Preview deploys | Cloudflare adds `X-Robots-Tag: noindex` on preview URLs by default ([docs](https://developers.cloudflare.com/pages/configuration/serving-pages/)) |

The earlier plan item **SEO-014 (enforce one production URL format) is satisfied live** even though `SEO_IMPLEMENTATION_PLAN.md` still shows it unchecked.

### 2.2 Required — live `robots.txt` is overridden by Cloudflare managed content (config drift)

`src/app/robots.ts:6-13` emits only `User-Agent: * / Allow: / / Sitemap: …`, and `out/robots.txt` is exactly that (61 B). The **live** file is ~2.5 KB: Cloudflare's prepended managed block plus the repo block. Cloudflare documents that this happens when **Bot Preference Sync** is enabled and at least one AI policy is set to Disallow/Block ([Managed robots.txt docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)).

Consequences and judgement:
- **Google Search: unaffected.** Googlebot is allowed; Google-Extended/GoogleOther are Google *other* products, not Search ranking ([Google crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers) — not fetched, standard behaviour).
- **AI answer visibility: affected.** GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider, etc. are disallowed. If the owner wants to be *cited by* AI assistants that respect robots.txt, training blocks are usually safe but **`ai-input` / retrieval crawlers matter**; current Content-Signal is `search=yes,ai-train=no,use=reference`, which permits reference use but the per-bot Disallows still block the named fetchers. Owner decision, not code.
- **Source of truth is broken:** editing `robots.ts` no longer changes what Google sees. Either manage robots policy in the Cloudflare dashboard (document it) or disable Bot Preference Sync to keep source authoritative.
- Google Search Console may report "Syntax not understood" for `Content-Signal` lines; Cloudflare states no observed SEO impact ([docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)).

### 2.3 Required — production headers / orphan assets

- **HSTS:** `strict-transport-security: max-age=0` — effectively disabled. Owner action in Cloudflare TLS settings (not a confirmed ranking signal, but expected hygiene — Optional-to-Required).
- **5 MB orphan image still public:** `public/images/hero/landing_screen_background.png` (5,046,465 B; live `200`, ~4.75 MB compressed) has **zero source references** (grep: only mentioned in `SEO_IMPLEMENTATION_PLAN.md:67`). Delete it; it is deploy bloat and a pointless crawlable object.
- **No CSP / X-Frame-Options** — security, out of SEO scope (noted for code review).
- `_headers` only sets a content type for `/site-description.jsonld` (`public/_headers:1-2`); no cache policy for hashed `/_next/static/*` (Optional: `Cache-Control: public, max-age=31536000, immutable`).

### 2.4 Required — RSC payload `.txt` files are crawlable; `_routes.json` grows unboundedly

- Next 16 static export writes RSC payloads (`/index.txt`, `/about.txt`, `/projects/qeemat.txt`, `/__next._head.txt`, …). They return `200 text/plain` with no `X-Robots-Tag` (verified live). They are not linked or sitemapped, so risk is low, but they are duplicate text representations of pages. **Nit/Optional:** add `Disallow: /_markdown/` to `robots.ts` and, if desired, an `X-Robots-Tag: noindex` Transform Rule for `*.txt` (Cloudflare `_headers` wildcards only work at the end of a path, so this is awkward in `_headers`). Do **not** delete the `.txt` files — App Router client navigation needs them.
- `scripts/generate-markdown.mjs:69-77` registers each route **three times** (`/about`, `/about/`, `/about.html`) in `_routes.json`. Result: **32 include rules for 10 pages** (`out/_routes.json`). Cloudflare's cap is **100 include+exclude rules combined** ([Routing docs](https://developers.cloudflare.com/pages/functions/routing/)), so the blog hits the cap at roughly 33 pages. Fix: register only the clean route:
  ```js
  // scripts/generate-markdown.mjs:71-72 — replace with:
  pages[route] = assetPath          // drop `${route}/` and `/${name}` variants
  ```
  Pages already 308-redirects `.html`/trailing-slash variants *before* the Function is relevant, so nothing is lost. Also confirm **Settings → Runtime → fail-open/closed = fail open** so a Functions quota event cannot serve an error page on indexable routes.

### 2.5 Deployment freshness

Sampled live HTML sizes equal the fresh build (`out/index.html` 26,943 B; `out/about.html` 24,569 B) and live responses contain HEAD-only features (`Link … describedby`, `site-description.jsonld`). **No evidence of a stale deployment.** Live/source differences found are edge config (robots), not code.

---

## 3. Per-route metadata

All years/titles below are from the fresh `out/` build; OG/Twitter image is `https://bruh.ae/images/social/portfolio-social.png` (1200×630, 866 KB) for **every** route.

| Route | `<title>` (chars) | Meta description (chars) | Canonical | JSON-LD |
|---|---|---|---|---|
| `/` | `Adam's Portfolio` (16) | "Projects, commentary, and experiments by Adam." (46) | `https://bruh.ae` | `WebSite` only |
| `/about` | `About Adam — Projects, Commentary & Experiments` (47) | 77 | ✅ | **none** |
| `/contact` | `Contact Adam` (12) | 73 | ✅ | **none** |
| `/projects` | `Projects — Adam's Portfolio` (27) | 57 | ✅ | **none** |
| `/projects/layla-ai` | `Layla AI — Adam's Portfolio` (27) | 148 | ✅ | **none** |
| `/projects/qeemat` | `Qeemat — UAE Price Tracker for Android` (38) | 105 | ✅ | **none** |
| `/writing` | `Commentary — Adam's Portfolio` (29) | 47 | ✅ | **none** |
| `/writing/how-a-tech-company-accidentally-becomes-political` | …`- Adam's Portfolio` (68) | 114 | ✅ | `Article` (weak) |
| `/writing/quiet-death-saas-pricing-power` | …`- Adam's Portfolio` (56) | 125 | ✅ | `Article` (weak) |
| `/writing/ugly-truth-luxury-brands-ai-content` | …`- Adam's Portfolio` (70) | 122 | ✅ | `Article` (weak) |
| `/track-my-salah-privacy-policy` | `Track My Salah Privacy Policy` (29) | 42 | ✅ | none, `noindex, follow` |
| `404` | `Adam's Portfolio` (fallback) | 46 | none | none, `noindex` |

**Already good:** every indexable page has a unique title, unique description, absolute self-canonical, `og:title/description/url/site_name/image/type` and `twitter:card=summary_large_image/creator/image/alt`; writing pages correctly use `og:type=article`.

**META-1 (Critical) — no route's title or description contains "Adam Ahsan".** The homepage is the highest-value place to bind the name:
- `src/app/page.tsx:14-17` uses `title: "Adam's Portfolio"`, description "Projects, commentary, and experiments by Adam." (`SITE_NAME`/`SITE_DESCRIPTION` from `src/lib/site.ts:1-3`).
- `src/app/about/page.tsx:5-9`, `src/app/contact/page.tsx:4-8`, `src/app/projects/page.tsx:8-11`, `src/app/writing/page.tsx:6-10`, `src/app/writing/[slug]/page.tsx:25-30` all say "Adam"/"Adam's Portfolio".

Google's title-link guidance: keep titles descriptive, concise, brand concisely, put the site name at beginning/end with a delimiter; long titles truncate ([Title links](https://developers.google.com/search/docs/appearance/title-link), updated 2025-12-10). Recommended values (~≤60 chars; descriptions 120–155):

| Route | Recommended title | Recommended description |
|---|---|---|
| `/` | `Adam Ahsan — bruh.ae` | `Adam Ahsan is a Dubai-based builder working on AI products and local-first apps. Selected work: Layla AI at FACES and Qeemat, plus commentary.` |
| `/about` | `About Adam Ahsan — Dubai Product Builder` | `Meet Adam Ahsan, a Dubai-based builder shaped by technology, creativity and faith. AI products, local-first apps and commentary.` |
| `/projects` | `Projects by Adam Ahsan — Layla AI & Qeemat` | `Selected work by Adam Ahsan: Layla AI, the AI beauty coach inside the FACES app, and Qeemat, a local-first UAE price tracker.` |
| `/projects/layla-ai` | `Layla AI — AI Beauty Coach in FACES | Adam Ahsan` | keep existing 148-char description (trim to ≤155) |
| `/projects/qeemat` | `Qeemat — UAE Price Tracker for Android | Adam Ahsan` | keep (105) |
| `/writing` | `Commentary by Adam Ahsan — bruh.ae` | `Essays by Adam Ahsan on AI, platforms, luxury retail, SaaS and product choices.` |
| `/writing/[slug]` | `` `${post.title} — Adam Ahsan` `` | keep excerpt; article titles 56–68 chars before suffix → total may exceed 60: acceptable but prefer dropping long boilerplate (see META-3) |
| `/contact` | `Contact Adam Ahsan — bruh.ae` | `Get in touch with Adam Ahsan about AI, product work, or useful things to build.` |

**META-2 (Required) — thin homepage metadata and body copy.** Homepage title 16 chars / description 46 chars / 813 chars of visible text; Google has little on-page context for name + role + location. Add one visible sentence under the hero identity (design-preserving) and set the metadata above.

**META-3 (Nit) — suffix inconsistency:** writing detail uses `" - Adam's Portfolio"` (`src/app/writing/[slug]/page.tsx:27`) while project pages use `"— Adam's Portfolio"` (`src/app/projects/[slug]/page.tsx:26`). Standardise on `— Adam Ahsan` and stop repeating the site name (Google may drop a duplicated site name from title links — [Title links](https://developers.google.com/search/docs/appearance/title-link)).

**META-4 (Required, from open plan item SEO-012) — all 13 routes share one abstract-texture OG image.** The social card has no name, portrait, role or brand word; link previews for name searches are anonymous. Create route-specific 1200×630 cards (home, Qeemat, Layla, each article) and extend `createPageMetadata` (`src/lib/metadata.ts:9-57`) to accept `image`/`imageAlt` from project/post data; add `openGraph.publishedTime/modifiedTime/authors` for article routes (currently `og:type=article` with no `article:*` properties). Optional: `twitter:site`, `og:locale`, `og:image:type`.

**META-5 (Nit) — 404 title** falls back to "Adam's Portfolio" (`src/app/not-found.tsx` has no metadata; Next 404 pages can't export metadata reliably). Low priority; the 404 is correctly `noindex`.

---

## 4. Structured data

Current inventory (verified in built and live HTML, JSON parses cleanly — no syntax errors):

- `/` — `WebSite` (`@id: https://bruh.ae/#website`, name `Adam's Portfolio`), inline at `src/app/page.tsx:18-22,31`; also exported as `/site-description.jsonld` by `scripts/generate-markdown.mjs:56-62`.
- `/writing/[slug]` — `Article` at `src/app/writing/[slug]/page.tsx:53-70`: `headline`, `description`, `datePublished: "2026-09-13"` (date only, no timezone), `author: { @type: Person, name: "Adam" }`, `mainEntityOfPage` as string, `publisher: Organization "Adam's Portfolio"` (no url/logo needed — publisher is not in Google's current recommended list).
- `/about`, `/projects`, `/projects/*`, `/writing`, `/contact`, privacy — **no JSON-LD**.

Reference guidance used (fetched this session):
- Article (`Article`/`NewsArticle`/`BlogPosting`): "no required properties"; recommend `author` (+ `author.url` or `sameAs`), `author.name` only the name, `datePublished`/`dateModified` ISO 8601 **with timezone**, `headline`, `image` (crawlable, representative — not a logo; ≥50K px²; 16:9/4:3/1:1) — [Article](https://developers.google.com/search/docs/appearance/structured-data/article) (updated 2026-09-08).
- ProfilePage: supported; valid use case includes "an 'About Me' page on a blog site"; **required** `mainEntity` (Person, with `name`); recommended `sameAs`, `description`, `image`, `dateCreated`/`dateModified` — [Profile page](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
- Site names: add `WebSite` structured data on the home page with required `name` + `url`; use `alternateName` (e.g. `["bruh.ae","BRUH"]`) if the preferred name isn't chosen; the domain in lowercase is a strong fallback; keep home-page titles/`og:site_name` consistent with the chosen name — [Site names](https://developers.google.com/search/docs/appearance/site-names).
- Breadcrumb rich results are supported ([Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)); Software app markup exists ([Software app](https://developers.google.com/search/docs/appearance/structured-data/software-app)).
- Google explicitly says structured data is **not required** for generative-AI features and there's no special markup for them — [AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

**SD-1 (Critical) — add a Person entity to the graph and reference it by `@id`.** New `src/lib/schema.ts` (single source of truth; values limited to facts already on the site):

```ts
import { SITE_URL } from './site'
export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const person = {
  '@type': 'Person', '@id': PERSON_ID, name: 'Adam Ahsan', alternateName: ['Adam'],
  url: `${SITE_URL}/about`, description: 'Dubai-based builder working on AI products, local-first apps and commentary.',
  jobTitle: 'Technical lead & builder', address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
  knowsAbout: ['AI products', 'Conversational commerce', 'React Native', 'Local-first apps'],
  sameAs: ['https://github.com/AdamJeddy', 'https://www.linkedin.com/in/adamahsan/',
           'https://x.com/A7damn', 'https://uhdam.medium.com/', 'https://uhwriter.substack.com/'],
}
```

**SD-2 (Critical/Required) — upgrade `WebSite` and publish a connected graph.** Replace `src/app/page.tsx:18-22` with:

```json
{ "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://bruh.ae/#website", "url": "https://bruh.ae/",
      "name": "Adam Ahsan", "alternateName": ["bruh.ae", "BRUH"],
      "description": "Portfolio and commentary by Adam Ahsan.",
      "inLanguage": "en", "publisher": { "@id": "https://bruh.ae/#person" },
      "author": { "@id": "https://bruh.ae/#person" } },
    { "@type": "Person", "@id": "https://bruh.ae/#person", "name": "Adam Ahsan", "url": "https://bruh.ae/about",
      "sameAs": ["https://github.com/AdamJeddy", "https://www.linkedin.com/in/adamahsan/", "https://x.com/A7damn"] }
  ] }
```

Keep the `Person` node identical wherever it appears (`@id` reuse), and update `SITE_NAME` to `Adam Ahsan` (`src/lib/site.ts:2`) so `og:site_name`, `application-name` and `publisher` agree with the site name Google will consider. Update `site-description.jsonld` generation (`scripts/generate-markdown.mjs:56-62` only extracts `@type === 'WebSite'`; change it to write the whole graph) so agents see the Person too.

**SD-3 (Required) — `ProfilePage` on `/about`.** Add to `/about` (`src/app/about/page.tsx`):

```json
{ "@context":"https://schema.org", "@type":"ProfilePage", "@id":"https://bruh.ae/about#profilepage",
  "url":"https://bruh.ae/about", "dateModified":"2026-11-01",
  "mainEntity": { "@id":"https://bruh.ae/#person" } }
```

And make the About page's first paragraph/`h1` actually contain the name (`src/app/about/page.tsx:72-76`): H1 currently "The person behind all of it.", intro "I'm Adam, based in Dubai." → recommended H1 "Adam Ahsan — the person behind all of it." and intro "I'm Adam Ahsan, based in Dubai." Content guidelines require the page's focus to be a single person; the name should be visible, not just in schema.

**SD-4 (Required) — fix the Article block** (`src/app/writing/[slug]/page.tsx:53-70`). Replace with:

```ts
const articleJsonLd = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  '@id': `${SITE_URL}/writing/${post.slug}#article`,
  headline: post.title, description: post.excerpt,
  datePublished: `${post.publishedAt}T00:00:00+04:00`,   // or add a real ISO field to posts.ts
  dateModified: `${post.updatedAt}T00:00:00+04:00`,
  author: { '@id': `${SITE_URL}/#person` },
  url: `${SITE_URL}/writing/${post.slug}`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/writing/${post.slug}` },
  // image: add ONE relevant per-article image; omit rather than reuse the abstract social texture
})
```

Also change the visible bylines from "By Adam" to a linked "By Adam Ahsan → /about" (`src/app/writing/[slug]/page.tsx:92-96` and `:93`), and add visible publisher/updated info where truthful. This implements the still-unchecked SEO-022 intent.

**SD-5 (Optional) — `BreadcrumbList`** on project and article detail pages (Home → Projects → Qeemat; Home → Commentary → post), matching visible nav. Add `SoftwareApplication` for Qeemat on `/projects/qeemat` (`name`, `description`, `applicationCategory: UtilitiesApplication`, `operatingSystem: Android`, `author: {@id person}`, `codeRepository: https://github.com/AdamJeddy/Qeemat`). Do **not** invent offers/ratings to chase a rich result.

**SD-6 (Nit/Optional)** — add `ItemList` on `/projects` and `/writing`; `CollectionPage` wrappers are optional. Validate everything with the Rich Results Test and Schema Markup Validator after deploy.

---

## 5. Indexability, sitemap, crawling

**Already good → keep:** canonical host `https://bruh.ae`, all alternate URL forms 301/308 to canonical, sitemap 10/10 URLs return 200 with correct canonicals, no redirect chains, 404 returns 404 + `noindex`, privacy page `noindex` and excluded from sitemap, 0 broken internal links (Lead-verified), SSR text present for every route (no JS-only content), favicon request resolves, preview deployments noindex by default.

**TECH-1 (Required) — sitemap has no `<lastmod>` and carries useless fields.** `src/app/sitemap.ts:8-46` emits only `url` + `changeFrequency` + `priority` + build output. Google **ignores `<priority>` and `<changefreq>`** and uses `<lastmod>` only when it is consistently and verifiably accurate ([Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)). Add real dates from data:
```ts
...posts.map(post => ({ url: `${SITE_URL}/writing/${post.slug}`, lastModified: new Date(`${post.updatedAt}T00:00:00+04:00`) })),
...projects.map(p => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: projectUpdated[ p.slug ] })), // only if maintained
```
Use `lastModified` for static pages only if a real date is tracked; otherwise omit. Dropping `changeFrequency`/`priority` is fine.

**TECH-2 (Required) — favicon format is invisible to Google Search.** Only `/favicon.svg` is declared (`src/app/layout.tsx:58-60`; live `200 image/svg+xml`). Google Search supports **BMP, GIF, ICO, PNG, JPEG, PPM, TIFF** — **not SVG** — and recommends square, >48×48 px ([Favicons](https://developers.google.com/search/docs/appearance/favicon-in-search), updated 2026-10-27). Add `app/icon.png` (512×512) and `app/apple-icon.png` (or supply `icons: { icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }] }`) and keep the SVG for browsers. This affects the favicon in SERPs and brand recognition for "bruh" queries.

**TECH-3 (Nit) — `/llms.txt` returns 404.** This is **not a Google issue**: Google states it doesn't use `llms.txt` or similar AI text files for Search or its generative features ([AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). Leave it out of the Google checklist; whether to add one for other AI agents is a different (AI-readiness) decision.

**TECH-4 (Nit) — crawlable duplicate text assets.** `/index.txt`, `/about.txt`, `/__next._head.txt`, `/_markdown/*.md` all return 200 (see §2.4). Not linked from HTML and not in the sitemap, so discovery risk is minimal; add `Disallow: /_markdown/` + a Transform-Rule `X-Robots-Tag` for RSC `.txt` if you want them fully out of crawl paths.

**TECH-5 (Required) — make indexability resilient to edge behaviour:** verify Pages **fail-open** setting; keep `robots.txt` source of truth documented; ensure sitemap is submitted (owner action §9).

**TECH-6 (Optional) — `<link rel="preload">` Link header for Google Tag** appears in HTML `<head>` and the response `Link` header on every page: `</images/signal/qeemat-showcase.webp>` and the GA script are both preloaded. A third-party analytics script preloaded at high priority can compete with LCP resources; move GA to `lazyOnload`/production-only and consider removing the `next/script` preload-derived Link (see PERF-3).

---

## 6. Core Web Vitals — quantified risks

No PSI/CrUX data could be collected this session (API quota 429; low-traffic origin likely lacks field data anyway). Numbers below are **measured payloads from the fresh build and live edge**, not lab CWV; run PageSpeed Insights/CrUX before labelling any regression.

### 6.1 Measured per-page payload (Brotli transfer, live origin)

| Route | JS (modern, Br) | CSS (Br) | Fonts (preloaded) | HTML | Eager LCP image | Total before scroll |
|---|---|---|---|---|---|---|
| `/` | ~142,758 B (8 chunks; +40.6 KB legacy chunk modern browsers skip) | 14,035 B | **141,044 B / 5 files** | 26,943 B (raw) | 114,496 B `qeemat-showcase.webp` (preloaded) | **≈ 300 KB + GA** |
| `/about` | ~135 KB | 14,477 B | 141,044 B | 24,569 B | none (text LCP) | ≈ 285 KB + GA |
| `/projects` | ~135–140 KB | 14 KB | 141,044 B | 18,920 B | 114,496 B (priority) | ≈ 290 KB + GA |
| `/projects/layla-ai` | ~141 KB | 17,712 B | 141,044 B | 53,498 B | **2,000,931 B PNG** (preloaded) | **≈ 2.4 MB before scroll** |
| Article pages | ~135 KB | 14,477 B | 141,044 B | 28–51 KB | none | ≈ 285 KB + GA |
| `/writing` | ~135 KB | 14,477 B | 141,044 B | 19,029 B | none | ≈ 285 KB + GA |

Homepage `/` also ships: 12 `<img>` tags, 1,801,061 B of font files across all subsets in the build (only 141,044 B is preloaded/loaded on Latin pages), and 259,702 B of referenced images (desktop variant set); mobile swaps the Layla showcase for a 131,092 B variant via `<picture>`.

### 6.2 LCP risks (ranked)

1. **PERF-1 (Critical) — `/projects/layla-ai` LCP is a 2.0 MB PNG.** `src/lib/layla-showcase.ts:27-31` (`layla-editorial-hero-v2.png`, 1536×1024) rendered with `priority` + `unoptimized` in `src/components/projects/LaylaShowcase.tsx` (hero `<Image>`). It is preloaded (`<link rel=preload as=image>`) — good priority, terrible bytes; under `output: 'export'` `next/image` cannot resize, so the full PNG is the LCP resource on the page most likely to be shared/cited. Even on a fast 9 Mbps connection, ~1.8 s is spent just fetching it before decode; on 400 kbps it is ~40 s. **Fix:** export WebP/AVIF variants (1536w and ~900w) at build time (sharp script) and reference with `<picture>`/`srcset` + `sizes`; target ≤250 KB. This alone removes the page's CWV red flag.
2. **PERF-2 (Critical) — 9.64 MB of images on `/projects/layla-ai`** (13 images: 2,000,931; 1,495,666; 1,375,175; 1,077,506; 792,818; 645,407; 532,156; 496,243; 477,161; 327,145; 291,460; 120,056; 8,125 bytes). Most are lazy-loaded (good) and all have `width`/`height` (no CLS), but anyone scrolling the case study pulls ~10 MB on mobile. Convert the PNGs to WebP (~70–85 % reduction typical) and add responsive widths; replace screenshot JPEGs with appropriately sized WebP.
3. **PERF-3 (Required) — 5 font families, 141 KB, preloaded on every page.** `src/app/layout.tsx:2,17-46` declares Oswald, Space Grotesk, Geist, Geist Mono and Inter Tight (Inter Tight is imported **again** in `src/app/page.tsx:3,12`, same file). The 5 preloads are 141,044 B — the single largest render-critical payload after HTML. Evidence of waste: `--font-oswald` is used only by legacy selectors whose classes no longer render (`globals.css:664,717,1151` — `.home-project-title-row`, `.home-commentary-title`, `.about-influence`; current pages use `signal-*`/`studio-*` classes), so **remove Oswald from the layout** (−21,412 B preload) and consolidate the duplicate Inter Tight import by pointing `signal.css:16` at `var(--font-studio-page)`. Geist (sans) appears only in legacy/`legal-article` selectors on current pages; consider dropping it too. Target ≤3 families / ≤80 KB preload.
4. **PERF-4 (Optional) — homepage image preload may be below the fold.** `/` preloads `qeemat-showcase.webp` with `priority` (`src/app/page.tsx:63`) while the hero is a large text block (h1 `clamp(74px,10.25vw,210px)`, `src/app/signal.css:16-20`); the first project section starts after the hero. Verify with PSI that the mobile LCP element is the qeemat image before keeping an aggressive preload (currently harmless but competes with font/CSS for bandwidth). The `priority` on the first project thumbnail on `/projects` (`src/app/projects/page.tsx:32`) is correct.

### 6.3 Other performance findings

- **PERF-5 (Required) — no responsive image pipeline.** Every content `<Image>` is `unoptimized` (`src/app/page.tsx:63`, `src/components/media/ProjectShowcase.tsx:12`, `LaylaShowcase.tsx`); static export disables Next Image Optimization, and there is only one manual mobile `<source>` (`homepage-projects.ts:19`). A 390 px phone downloads the 1200/1536 px asset. Add a build-time sharp step producing `-800w/-1200w/-1600w.webp` and use `srcSet`/`sizes`.
- **PERF-6 (Optional) — analytics.** `src/app/layout.tsx:70-81` loads GA4 afterInteractive on every page (inline `gtag('config')` confirmed once in built HTML) but there is **no page_view on App Router client-side navigations** — GA4 will under-report internal navigation. Add a `usePathname()` + `gtag('event','page_view')` client component (or `send_page_view:false` and send manually). Also gate on production (`process.env.NODE_ENV`) so dev traffic doesn't pollute.
- **PERF-7 (Optional) — cache headers for immutable assets.** Live `/_next/static/chunks/*.js|css` and `fonts` return `cache-control: public, max-age=14400, must-revalidate`; hashed files can be `public, max-age=31536000, immutable` via `public/_headers`, saving repeat revalidations (safe for content-hashed paths; Pages docs caution against custom caching only where it could mask redirects/functions).
- **PERF-8 (Optional) — legacy CSS weight.** `globals.css` is ~2,100 lines and the homepage loads 55.7 KB raw globals CSS + 10 KB signal CSS; much of globals targets the retired Aino/notebook design. Removing unused legacy rules/fonts (Oswald ties in) reduces CSSOM work and the global bundle on every route.
- **CLS:** all content images have intrinsic `width`/`height`; `next/font` applies fallback metric adjustment; no obvious CLS culprits in markup. INP/TBT: client components (`Nav`, `Footer` clock ticking every second via `useLiveClock`, `SignalSweep` click interception, `GridProvider` resize measurement, optional `SignalMotion` scroll rAF on `/`) are the main main-thread work; measure with PSI before optimising further.

---

## 7. Content, E-E-A-T and entity/brand discoverability

### 7.1 Name/brand presence in server-rendered page text

| Page | "Adam Ahsan" | "Adam" | "Dubai" | "bruh" | Visible text (chars) |
|---|---|---|---|---|---|
| `/` | **1** | 3 | 2 | 2 (nav "BRUH") | **813** |
| `/about` | **0** | 3 | 3 | 2 | 1,990 |
| `/contact` | 0 | 2 | 1 | 2 | 543 |
| `/projects` | 0 | 2 | 1 | 2 | 568 |
| `/writing` | 0 | 2 | 1 | 2 | 884 |
| `/projects/layla-ai` | 0 | 2 | 1 | 2 | 4,307 |
| `/projects/qeemat` | 0 | 1 | 1 | 2 | 1,666 |
| Article (quiet-death…) | 0 | 3 | 1 | 2 | 2,765 |

- "Adam Ahsan" is in the HTML **only** at `src/app/page.tsx:37` (`<p>Adam Ahsan</p>`, unlinked, not in a heading). It is **0× in every title, description, JSON-LD and alt**, 0× on `/about` (which is the entity page), and the only other occurrence in the codebase is the client-only transit label `src/components/SignalSweep.tsx:27` (never in HTML).
- **"bruh.ae" never appears in visible text** anywhere; the brand token is the nav logo "BRUH" (2× per page). Domain + brand match is decent for "bruh", weak for "bruh.ae".
- Location "Dubai" is on `/`, `/about`, footer (em-dash consistent), which supports "Adam Ahsan Dubai" over time, but Location is **not in any schema/description**.

**CONTENT-1 (Critical, same root cause as META-1/SD-1):** make the full name visible and structural — homepage title/description, `/about` H1+intro, article bylines ("By Adam Ahsan" linking `/about`), Person schema, and a "bruh.ae" mention in footer/about copy (e.g. "Working from Dubai — this site is bruh.ae"). Google can then associate the site, name and brand consistently ([Site names](https://developers.google.com/search/docs/appearance/site-names) explicitly asks for consistency between structured data and on-page references).

**CONTENT-2 (Required) — E-E-A-T gaps on `/about`.** The page has voice but not proof: no role/timeline/employer/education, no links to LinkedIn/X visible (GitHub only, `src/app/about/page.tsx:145-152`), no author photo. It is the page Google would most plausibly treat as the profile page. Add (owner-approved facts): full name, one-line role ("Product & AI builder, Dubai"), 3–5 experience entries (e.g. technical integration lead on Layla AI in the FACES app — already stated on `/projects/layla-ai`; Qeemat creator), external profile links (GitHub, LinkedIn, X, Medium, Substack), optional portrait. This supports `ProfilePage` and author authority for the essays.

**CONTENT-3 (Speculation, practitioner judgement) — name-query competition.** During audits, queries for "Adam Ahsan" surfaced other people with the same name (e.g. a designer on Contra, a Booksie writer) and **not** bruh.ae; a generic search engine showed the homepage for `"Adam Ahsan" bruh.ae` (Lead-confirmed, DuckDuckGo/Bing index), while the `site:bruh.ae` probe returned nothing. This is **indicative only** — it is not Google coverage evidence. Realistic target: rank for "Adam Ahsan" + a qualifier (Dubai, bruh.ae, portfolio, Layla AI, Qeemat), and for "bruh.ae"/"bruh" brand queries; a knowledge panel is **not** guaranteed by schema and typically requires independent third-party coverage (speculation, not Google-confirmed).

**CONTENT-4 (Required) — articles are syndicated on Medium/Substack.** `src/lib/posts.ts` stores `sourceUrl`/`sourceLinks` (e.g. Medium, Substack) and renders "Read the original". The site versions are full-length (good), but the originals sit on higher-authority domains; Google may choose either. Owner decision: make the site the canonical long-term home (site version fuller/updated; link out with "original" relationship), and add `isBasedOn`/`citation` in Article JSON-LD to connect the versions — do not expect a penalty for syndication (Google handles duplicates by clustering, not penalising; practitioner interpretation).

**CONTENT-5 (Nit) — internal linking/anchors.** Depth is fine (every page ≤2 clicks; footer/nav consistent), but make the name an anchor: `<Link href="/about">Adam Ahsan</Link>` in the homepage identity (`src/app/page.tsx:37`), and improve footer anchor text ("Contribute to my work" → "GitHub — Adam Jeddy"). External social links should use `<a>` not `next/link` (they already open new tabs; `Link` on external URLs is a nit, not an SEO problem).

---

## 8. Prioritised top 10

| # | Severity | Fix | Where |
|---|---|---|---|
| 1 | Critical | Put "Adam Ahsan" in homepage/about titles+descriptions, `/about` H1/intro, article bylines; add an `Adam Ahsan → /about` link | `src/app/page.tsx:14-17,37`; `src/app/about/page.tsx:5-9,72-76`; `src/app/writing/[slug]/page.tsx:92-96` |
| 2 | Critical | Add `Person` entity + `@id` graph; upgrade `WebSite` (name/alternateName `bruh.ae`), add `ProfilePage` on `/about`, update `site-description.jsonld` | new `src/lib/schema.ts`; `src/app/page.tsx:18-31`; `src/app/about/page.tsx`; `scripts/generate-markdown.mjs:56-62` |
| 3 | Critical | Replace 2 MB Layla hero PNG with WebP/AVIF variants; convert 9.64 MB page images + add `srcset` | `src/lib/layla-showcase.ts:27-31`; `src/components/projects/LaylaShowcase.tsx`; build script |
| 4 | Required | Fix Article JSON-LD (author `@id`, `url`, ISO dates with timezone, optional representative image, `mainEntityOfPage` object) | `src/app/writing/[slug]/page.tsx:53-70` |
| 5 | Required | Reduce font payload: remove unused Oswald, dedupe Inter Tight import, target ≤3 families/≤80 KB preload | `src/app/layout.tsx:2,17-46,67`; `src/app/page.tsx:3,12`; `src/app/signal.css:16` |
| 6 | Required | Add PNG/ICO favicon (512×512) alongside SVG for Google favicon eligibility | `src/app/layout.tsx:58-60`; add `src/app/icon.png` |
| 7 | Required | Sitemap `<lastmod>` from content dates; drop ignored `priority`/`changefreq` | `src/app/sitemap.ts:8-46` |
| 8 | Required | Reconcile Cloudflare managed `robots.txt` drift + label AI-crawler policy as an owner decision; verify Fail-open | Cloudflare dashboard (owner) |
| 9 | Required | Route-specific 1200×630 OG images incl. name/brand; article `openGraph` published/modified/authors | `src/lib/metadata.ts:9-57`; `src/lib/site.ts:5`; project/post data |
| 10 | Required/Optional | GA4 page_view on client navigation; remove 5 MB orphan PNG; immutable cache header for hashed assets; shrink `_routes.json` | `src/app/layout.tsx:70-81`; delete `public/images/hero/landing_screen_background.png`; `public/_headers`; `scripts/generate-markdown.mjs:69-77` |

---

## 9. Severity-labelled findings index

**Critical**
- C1 No title/description/JSON-LD/heading contains "Adam Ahsan"; name appears once, unlinked (§3 META-1, §7 CONTENT-1).
- C2 No `Person`/`ProfilePage`; entity graph absent; site name `Adam's Portfolio` generic (§4 SD-1/2/3).
- C3 `/projects/layla-ai`: 2,000,931 B LCP PNG + 9.64 MB images; static-export images unresized (§6 PERF-1/2).

**Required**
- R1 Live robots.txt overridden by Cloudflare managed block; source-of-truth + AI policy decision (§2.2).
- R2 Only SVG favicon → Google Search favicon unsupported format (§5 TECH-2).
- R3 Article schema author/date/url/image weak (§4 SD-4).
- R4 `/about` lacks full name, credentials, sameAs profile links; byline "By Adam" (§7 CONTENT-2).
- R5 Sitemap missing `<lastmod>`, includes ignored fields (§5 TECH-1).
- R6 5 font families/141 KB preloaded every page; unused Oswald; duplicate Inter Tight import (§6 PERF-3).
- R7 Homepage thin: title 16 chars, description 46 chars, 813 chars text (§3 META-2).
- R8 Single generic OG image on all routes; no article OG metadata (§3 META-4).
- R9 GA4 SPA pageviews missing (§6 PERF-6).
- R10 Orphan 5 MB PNG deployed (§2.3).
- R11 `_routes.json` 32 rules → 100-rule cap at ~33 pages; verify fail-open (§2.4).
- R12 Stale `SEO_IMPLEMENTATION_PLAN.md` decisions/statuses conflict with current code and the owner's new name/Dubai goal (§11).

**Optional**
- O1 BreadcrumbList rich results on detail pages (§4 SD-5).
- O2 `SoftwareApplication` for Qeemat (no fabricated ratings/offers) (§4 SD-5).
- O3 Responsive `srcset` pipeline beyond the single mobile `<source>` (§6 PERF-5).
- O4 `X-Robots-Tag: noindex` / robots disallow for `/_markdown/` and RSC `.txt` duplicates (§2.4, §5 TECH-4).
- O5 Immutable caching for content-hashed `/_next/static/*` (§6 PERF-7).
- O6 Add `twitter:site`, `og:locale`, `og:image:type`; standardise title delimiter (§3 META-3/4).
- O7 HSTS `max-age=0`; consider proper HSTS (§2.3).
- O8 Add `bruh.ae` brand mention in footer/about copy; footer anchor text (§7 CONTENT-1/5).
- O9 Consider a per-post representative image for Article rich results.
- O10 Remove `.nojekyll` (GitHub Pages artefact, irrelevant on Cloudflare) and stale `dist/` build.

**Nit**
- N1 `changeFrequency`/`priority` in sitemap (ignored by Google).
- N2 404 title falls back to brand name.
- N3 `creator: 'Adam'`/`publisher` meta values (`src/app/layout.tsx:53-54`) — not used by Google.
- N4 Unused legacy CSS (Oswald/Geist classes) inflates the global stylesheet.
- N5 `_routes.json` includes `.html`/trailing-slash duplicates.
- N6 `next.config.ts` has no explicit `trailingSlash` (default is correct; Cloudflare pins the behaviour — leave as is).

---

## 10. Already good (do not regress)

- Canonical host decision implemented end-to-end: http→https 301, www→apex 301, `.html`/trailing-slash variants 308 to canonical, no chains. Preview URLs noindex by Pages default.
- Every indexable route: unique title, unique description, absolute self-canonical, OG/Twitter tags; `og:type=article` on posts; article `headline`/dates/author present.
- `robots.txt` allows Googlebot and references the sitemap; sitemap valid, 10/10 URLs 200, privacy page intentionally `noindex` and excluded; 404 returns real 404 + `noindex`.
- All visible content is server-rendered HTML (no JS-gated text), one `h1` per page, correct `lang="en"`, viewport meta, descriptive slugs.
- Images: all 13 content/decorative tags have `width`/`height`; content images have descriptive alt text; empty alt only on decorative arrow icons (correct). Hero priority preload on homepage/project pages is intentional.
- Internal linking coherent (nav + footer + in-body cross-links); 0 broken internal links (Lead-verified).
- Markdown content negotiation + `/site-description.jsonld` + `Link describedby` on the homepage is a genuine AI-readiness feature (does not harm Google), and `_worker.js`/`_headers` are correctly deployed and verified live.
- HTTPS with nosniff/referrer-policy/ACAO set by Pages; no mixed content; Cloudflare edge caching defaults sane.

---

## 11. Owner actions (cannot be done from code)

1. **Google Search Console (highest priority):** create a **Domain** property for `bruh.ae`, verify by DNS, submit `https://bruh.ae/sitemap.xml`, run URL Inspection + request indexing for `/`, `/about`, `/projects/qeemat`, `/projects/layla-ai` and the three articles. Enable inclusion in Google's generative-AI features if offered (Search Console setting referenced by [Google's AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)); review Core Web Vitals and Generative-AI performance reports once data exists.
2. **Bing / IndexNow:** add `bruh.ae` in Bing Webmaster Tools (can import from GSC), submit the sitemap, and enable **Cloudflare Crawler Hints** (Dashboard → Caching → Configuration → Crawler Hints), which uses IndexNow for content-change notifications ([Cloudflare Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/)). Note: Google does not use IndexNow.
3. **Cloudflare robots/AI policy:** decide the strategy for AI crawlers. Current managed `robots.txt` blocks GPTBot/ClaudeBot/CCBot/Google-Extended/etc. If the goal includes being cited by AI assistants, align Bot Preference Sync / AI Crawl Control policies (allow `ai-input`/retrieval use while optionally denying training) and document the decision; otherwise keep training blocked knowingly. Either way, stop maintaining conflicting copies in `robots.ts` vs dashboard.
4. **Cloudflare settings:** verify **Fail open** for Pages Functions (Settings → Runtime), fix HSTS (`max-age` ≥ 6 months, includeSubDomains once confident), keep preview deployments noindex.
5. **External profiles (entity consistency):** GitHub `AdamJeddy` currently shows display name **"Adam"**, bio "To infinity and beyond", website **"Bruh.ae"** (no scheme — verify it renders as a clickable `https://bruh.ae` link), no X username (verified via GitHub API). Change display name to **Adam Ahsan**, website to `https://bruh.ae`, bio to role+location, add X. LinkedIn `/in/adamahsan/` — confirm full name "Adam Ahsan", headline, website `bruh.ae`, location Dubai. X `@A7damn` — display name "Adam Ahsan", bio link to bruh.ae. Substack (verified live: "About - **Adam A**", **no bruh.ae mentions**) — set display name to Adam Ahsan and add site link. Medium (`uhdam`) — update display name/bio and link site (profile returned 403 to this audit, unverified). Link `bruh.ae` from every profile and from the Qeemat GitHub README; these are the realistic seed backlinks for name queries.
6. **Contact/portrait assets & social cards:** supply a headshot (Person.image is recommended) and a branded default OG card with name + "bruh.ae" + role (current card is an abstract texture, 866 KB PNG).
7. **Content:** approve the About-page facts (role/timeline/employer phrasing), per-article hero images, and whether to expand the Qeemat case study (open plan item SEO-021). Decide article syndication canonical strategy (site as home; Medium/Substack originals linked).
8. **Google Business Profile:** not applicable unless Adam offers local services publicly; a personal portfolio does not qualify — skip (judgement, based on Google's business-details feature scope).
9. **Domain canonicalisation:** already resolved (apex, www 301); no action except continuing to use `https://bruh.ae` links everywhere.

---

## 12. Reconciliation with `SEO_IMPLEMENTATION_PLAN.md` (587 lines, last updated 2026-07-18 — stale)

| Plan claim/status | Reality in code/live (2026-11-01) |
|---|---|
| Decision log: public identity is `Adam`, "do not add Dubai/UAE positioning", Person/ProfilePage deferred | **Contradicted by current code and the human's goal:** homepage shows "Adam Ahsan" + "Dubai, UAE" (`src/app/page.tsx:37`), About/Contact titles use "Adam", footer says "Dubai, UAE". Update the decision log: full name + Dubai positioning is now explicitly wanted; Person/ProfilePage should be un-deferred. |
| SEO-014 "enforce one production URL format" unchecked | **Satisfied live:** http/HTTPS, www/apex, `.html` and trailing-slash all 301/308 to canonical, no chains. |
| SEO-013 "sitemap/robots" complete; "add stable publishedAt/updatedAt" | Sitemap exists but **has no `<lastmod>`** despite `posts.updatedAt` existing; also carries ignored `priority`/`changefreq`. |
| SEO-021 Qeemat case study + `SoftwareApplication` — not started | Case study content now exists (`src/lib/project-studies.ts`), but **no SoftwareApplication JSON-LD**. |
| SEO-022 "Article JSON-LD, full body, visible author/date, representative image" — not started | Full bodies + `Article` JSON-LD + visible dates now exist; **author is still "Adam", no url/@id/image**, so only partially done. |
| SEO-031 "remove unused Oswald, reduce fonts/JS, remove 5 MB hero PNG" — not started | Still all true: 5 families preloaded (Inter Tight imported twice), orphan PNG present, live JS ~143 KB (modern) + 40 KB legacy. Re-prioritise as Required. |
| SEO-012 route-specific social images — in progress | Still only the default texture image used by all routes. |
| SEO-030 accessibility/menu — in progress | Implemented per code (aria-expanded/controls, focus trap, Esc, inert, reduced motion); manual device checks still pending per plan. |
| SEO-032 CWV monitoring — not started | No PSI/CrUX/GSC data exists; this audit could not collect PSI data (quota), so first owner action after deploy is a PSI run. |
| SEO-001/020 "defer Person/ProfilePage until fuller name chosen" | The fuller name is now in visible copy; update the plan's decision log and open a `Person`/`ProfilePage` task. |
| Plan baseline says robots/sitemap/canonical/OG absent, titles duplicated | All fixed; baseline section is historical only — future readers should not treat it as current. |

---

## 13. Sources (external guidance used)

- Google Search Central — Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article (updated 2026-09-08)
- Google Search Central — Profile page structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google Search Central — Site names: https://developers.google.com/search/docs/appearance/site-names
- Google Search Central — Title links: https://developers.google.com/search/docs/appearance/title-link (updated 2025-12-10)
- Google Search Central — Favicons in Search: https://developers.google.com/search/docs/appearance/favicon-in-search (updated 2026-10-27)
- Google Search Central — Build and submit a sitemap (`priority`/`changefreq` ignored; `lastmod` advisory): https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central — Optimizing for generative AI features (llms.txt not used; structured data not required; GSC gen-AI report/opt-in): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (updated 2026-07-10)
- Google Search Central — Breadcrumb / Software app structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb · https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google Search Central — Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals · thresholds (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75): https://web.dev/articles/vitals
- Google Search Central — Creating helpful, reliable, people-first content (E-E-A-T): https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Cloudflare — Serving Pages (HTML→extensionless redirects, 404 behaviour, default headers, preview noindex): https://developers.cloudflare.com/pages/configuration/serving-pages/ (updated 2026-10-10)
- Cloudflare — Pages Functions routing / `_routes.json` (100 include+exclude rule limit, fail open/closed): https://developers.cloudflare.com/pages/functions/routing/ (updated 2026-09-18)
- Cloudflare — Managed robots.txt / Content Signals (prepends managed directives when Bot Preference Sync enabled): https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/ (updated 2026-10-22) · AI Crawl Control: https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/
- Cloudflare — Crawler Hints / IndexNow: https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/ (updated 2026-08-14)
- Bing Webmaster Tools / IndexNow: https://www.bing.com/webmasters · https://www.indexnow.org/

## 14. Method and limitations

- Read-only source + build inspection (`src/**`, `public/_headers`, `cloudflare/markdown-worker.mjs`, `scripts/generate-markdown.mjs`, fresh `out/**`); no tracked files modified. The only file written is this report.
- Live checks via Node `fetch` against `https://bruh.ae` (redirect chains, status codes, headers, metadata, JSON-LD, RSC `.txt`, sitemap, robots, images). Cloudflare edge location from audit host may differ from Dubai; header/caching observations reflect one edge colo.
- **Not available in this session:** Google Search Console (index coverage/queries/CWV), GA4, CrUX field data, PSI lab data (API returned `429 quota exceeded`), Google's own index status. Search-visibility statements in §7 are from a generic search tool and are **indicative, not Google-confirmed**.
- Transfer sizes measured with Brotli (`br`) against the live origin; HTML sizes are decoded byte counts. Fonts are served uncompressed (`identity`, `font/woff2`).
- "Speculation/judgement" is labelled where used (name-query competition, knowledge panel expectations, syndication clustering, AI-crawler policy effects on assistants). Google-confirmed facts are the cited developer docs above.
