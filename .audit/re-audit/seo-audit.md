# SEO re-audit — `feature/entity-seo-ai-hardening` (PR #19)

**Audited:** 2026-11-01 (Asia/Dubai) · **Branch:** `feature/entity-seo-ai-hardening`, HEAD `93d04d9e` (4 commits on `origin/dev`) · **Build:** fresh local `out/` regenerated 12:58 local (read-only); Lead ran lint/test/build green.
**Baseline:** my original audit, `.audit/findings/seo-audit.md` (pre-change `dev`, HEAD `d78003fc`). An independent measured-delta harness exists in this directory (`.audit/re-audit/measured-delta.md`); my numbers below are independently measured from the fresh build and agree with it except where noted.
**Production status (verified this session):** https://bruh.ae still serves the **pre-change** build — live `<title>` is `Adam's Portfolio`, no `Person` JSON-LD, no `icon-512.png`, old `Link` header set. The delta is **undeployed**; all "after" findings are from the local static export and source, not the live edge.
**Caveat:** no Search Console / GA / PSI / CrUX access, so no index-coverage or field-CWV numbers. No Rich Results Test run (external validator); JSON-LD was parsed programmatically and properties checked manually. Brotli sizes are local zlib estimates, not CDN-observed transfers. `_worker.js`, `_headers`, `_routes.json` and redirect behaviour cannot be fully tested until a preview/production deploy.

---

## 1. Delta scorecard (before → after)

| Axis | Before | After | Δ | Evidence |
|---|---|---|---|---|
| Indexability & crawl | A− | **A** | + | Same clean canonical/redirect/404/noindex state, plus `_routes.json` 32→11 rules, generated-`_headers` noindex for markdown mirrors, immutable cache for hashed assets. Residual: production robots.txt still Cloudflare-managed (owner action). |
| Metadata | B− | **A−** | ++ | Name in **11/11** titles + OG/Twitter titles (was 0/11); name in 5/11 descriptions; branded OG card + name-bearing alt on every route; article `article:published_time/modified_time/author` present. Residual: 4 thin index titles (18–23 chars), single shared OG image, 404 title. |
| Structured data | D+ | **A−** | +++ | Nodes: `{WebSite:1, Article:3}` → `{Person:2, ProfilePage:1, WebSite:1, CreativeWork:1, SoftwareApplication:1, Article:3}`; pages with any schema 4/11→7/11; all JSON parses. Residual: dangling `@id` refs, no Article image, no BreadcrumbList. |
| Performance / CWV | C− | **B+** | ++ | Font preloads 5→4 / 141,044→119,632 B (−15.2%); Layla raster 9,635,004→918,045 B (−90.5%); Layla LCP hero 2,000,931→81,458 B (−95.9%, +900w variant); shipped images 18.98 MB→1.31 MB (−93.1%); immutable caching for `/_next/static/*`. No field data to confirm CWV. |
| Content / E-E-A-T | C | **B** | + | About page now names Adam Ahsan in the H1, adds role, Dubai, selected work, contact, GitHub/LinkedIn/X/Medium profiles and 5 visible Q&A answers; article byline "By Adam Ahsan" → `/about`; project pages add "Built by Adam Ahsan"; homepage adds a bruh.ae/name sentence (visible text 813→907 chars). Residual: no experience timeline/photo; no article images. |
| Entity / brand | D | **B+** | +++ | Person `@id` graph with `sameAs` ×5, jobTitle, Dubai address, knowsAbout; WebSite name **Adam Ahsan** + `alternateName ["bruh.ae","BRUH"]`; ProfilePage on `/about`; name occurrences in SSR text: home 1→3, about 0→7, every page ≥1. |
| **Overall** | **C+** | **B+** | +1 grade band | Technically deployable; remaining work is polish + deployment verification + owner actions. |

---

## 2. Measured before → after

### 2.1 Build / crawl infrastructure

| Metric | Before | After | Change |
|---|---|---|---|
| `out/` total size | 21,316,065 B | 3,739,367 B | **−82.5%** |
| `out/` file count | 196 | 186 | −5.1% |
| `out/images` size / count | 18,980,781 B / 28 | 1,309,323 B / 19 | **−93.1%** |
| Raster files removed / added | — | 22 removed, 15 WebP added | 28→19 files |
| `_routes.json` include rules | 32 | **11** (all clean URLs) | build guard `MAX_ROUTE_RULES = 90` (`scripts/generate-markdown.mjs:9,148-152`) |
| sitemap `<lastmod>` entries | 0 | **10/10** | static pages share one constant; posts use real `updatedAt` (see R5) |
| Font preloads per page | 5 / 141,044 B | **4 / 119,632 B** | −15.2% (Oswald removed) |
| Social/OG card | 866,349 B abstract texture | **42,310 B** branded 1200×630 | −95.1% |
| Favicons | SVG only | SVG + **icon-512.png (512×512)** + **apple-icon.png (180×180)** | Google-supported formats added |
| `_headers` | 1 block | 3 blocks (`/_markdown/*` noindex + markdown type; `/_next/static/*` immutable) | — |
| Worker response headers | none added | 4 security headers + `alternate`(markdown) + `describedby`(llms.txt) `Link` on mapped pages (`cloudflare/markdown-worker.mjs:14-21,44-51`) | deploy time only |
| `llms.txt` / `llms-full.txt` | absent | 3,087 B / 52,453 B | new (AI, not Google — see §6) |
| `site-description.jsonld` | WebSite only | full Person+WebSite graph, 1,434 B | mirrors homepage graph |
| Internal links / broken | — | 86 / **0 broken** | measured across 12 built pages |
| Canonicals / h1 count / privacy+404 noindex | correct | correct (unchanged) | verified in fresh build |

### 2.2 Per-route metadata and structured data

| Route | Title chars before→after | Description chars | Name in title/desc/OG | JSON-LD before→after |
|---|---|---|---|---|
| `/` | 16→**20** (`Adam Ahsan — bruh.ae`) | 46→89 | ✅/✅/✅ | WebSite → **Person+WebSite** |
| `/about` | 47→**18** (`About — Adam Ahsan`) | 77→98 | ✅/✅/✅ | none → **Person+ProfilePage** |
| `/contact` | 12→**20** | 73→79 | ✅/✅/✅ | none |
| `/projects` | 27→**21** | 57→103 | ✅/✅/✅ | none |
| `/projects/layla-ai` | 27→**21** | 148 | ✅/✅/✅ | none → **CreativeWork** |
| `/projects/qeemat` | 38→**50** | 105 | ✅/✅/✅ | none → **SoftwareApplication** |
| `/writing` | 29→**23** | 47→93 | ✅/✅/✅ | none |
| article: political | 68→**62** | 114 | ✅/✅/✅ | Article → **Article (upgraded)** |
| article: SaaS | 56→**50** | 125 | ✅/✅/✅ | Article → **Article (upgraded)** |
| article: luxury/AI | 70→**64** | 122 | ✅/✅/✅ | Article → **Article (upgraded)** |
| privacy (noindex) | 29→42 | 42 | ✅/—/✅ | none (correctly noindex, excluded from sitemap) |
| 404 | 16→20 (layout fallback) | 89 | — | none, `noindex` |

All `og:title`/`twitter:title` now equal the rendered title (name-bearing); `<meta name="author">` = "Adam Ahsan" on all pages; article pages emit `article:published_time`, `article:modified_time`, `article:author` with `+04:00` ISO timestamps. **Name-bearing counts: titles 0/11→11/11, OG/Twitter titles 0/11→11/11, descriptions 0/11→5/11, structured data 0/11→7/11.**

Built JSON-LD (parsed, valid):
- `/` — `@graph`: `Person#person` (name, alternateName ["Adam"], url /about, description, jobTitle "Product and AI builder", Dubai PostalAddress, knowsAbout×6, sameAs GitHub/LinkedIn/X/Medium/Substack) + `WebSite#website` (name "Adam Ahsan", alternateName ["bruh.ae","BRUH"], inLanguage, author/publisher → `#person`).
- `/about` — `Person` + `ProfilePage#profilepage` (`mainEntity`→`#person`, `isPartOf`→`#website`, `dateModified` 2026-11-01).
- Articles — `Article#article` with `headline`, `datePublished/dateModified` `YYYY-MM-DDT00:00:00+04:00`, `author { @id #person, name, url }`, `url`, `mainEntityOfPage { @type WebPage, @id }`, `isPartOf { @id #website }`, `publisher`.
- `/projects/qeemat` — `SoftwareApplication` (name, description, `UtilitiesApplication`, Android, url, `author` Person ref, `codeRepository` GitHub).
- `/projects/layla-ai` — `CreativeWork` (name, description, url, `creator`/`contributor` Person refs).

### 2.3 Visible name / brand signal (SSR text)

| Page | "Adam Ahsan" before→after | "Dubai" | Visible text chars |
|---|---|---|---|
| `/` | **1→3** | 2 | 813→907 |
| `/about` | **0→7** | 3→5 | 1,990→2,786 |
| `/contact` | 0→1 | 1 | — |
| `/projects` | 0→2 | 1 | — |
| `/writing` | 0→2 | 1 | — |
| `/projects/layla-ai` | 0→1 | 1 | — |
| `/projects/qeemat` | 0→2 | 1 | — |
| articles | 0→2 each | 1 | — |

H1 changes: `/about` H1 now "Adam Ahsan / The person behind all of it." (`src/app/about/page.tsx:104-107`); `/projects/layla-ai` H1 now "Layla AI — personal beauty advice, built into FACES." (`src/components/projects/LaylaShowcase.tsx:44`). `/`, `/projects`, `/writing`, `/contact` H1s keep the existing voice (judgement in §6). One `h1` per page retained.

### 2.4 Images / fonts / transfer

| Metric | Before | After | Change |
|---|---|---|---|
| Homepage referenced image bytes (all variants) | 395,639 B | 266,589 B | **−32.6%** |
| └ desktop initial set (qeemat + layla showcase + logo) | 264,547 B | 183,863 B | −30.5% |
| └ mobile set (qeemat + layla mobile + logo) | 253,713 B | 174,767 B | −31.1% |
| Layla page referenced images (13 tags) | 9,635,004 B | 918,045 B | **−90.5%** |
| └ Layla LCP hero | 2,000,931 B PNG | **81,458 B** WebP (1536w) + 33,984 B (900w) | **−95.9%** |
| Qeemat page images | ~314,942 B / 3 | 83,916 B / 1 | ~−73% |
| Homepage modern-JS raw | 465,595 B | 477,890 B | +2.6% (schema/page modules; local Brotli ≈132,130 B vs 142,758 B live before — not apples-to-apples) |
| Homepage CSS raw | 65,716 B | 58,358 B | −11.2% (local Brotli 11,808 B) |
| Font preload bytes | 141,044 B | 119,632 B | −15.2% |
| WebP intrinsic dimensions | — | verified: hero 1536×1024 / 900×600, order-support 878×1792, passport/feature shots match declared `width`/`height` | no CLS from stale dimensions |

---

## 3. Old Critical/Required findings — resolution

| ID | Status | Evidence |
|---|---|---|
| **C1** Name absent from title/desc/schema, once in body | **FIXED** | Name in 11/11 titles + OG/Twitter, 5/11 descriptions, Person schema, About H1 + 5 Q&A answers, homepage identity link + bruh.ae sentence, article bylines, project "Built by" lines. |
| **C2** No Person/ProfilePage/entity graph | **FIXED** | Home `Person+WebSite` graph with `@id`s; `/about` `ProfilePage`; articles/projects reference `#person`; `site-description.jsonld` mirrors graph; 11/11 pages carry author meta. |
| **C3** Layla 2 MB LCP PNG + 9.64 MB images | **FIXED** | Hero 2,000,931→81,458 B (−95.9%) with `srcset` 900w/1536w, `loading="eager"` + `fetchPriority="high"` (`LaylaShowcase.tsx:62-85`); page raster 9,635,004→918,045 B (−90.5%); dimensions verified; 22 dead assets deleted. |
| **R1** Live robots.txt overridden by Cloudflare managed block | **PARTIAL / owner action** | `src/app/robots.ts:15-27` now documents the drift and `README`/`SEO_IMPLEMENTATION_PLAN.md` record it; the policy itself still lives in the Cloudflare dashboard. Not fixable in code. |
| **R2** SVG-only favicon (Google unsupported format) | **FIXED** | `src/app/layout.tsx:56-62` emits SVG + **512×512 PNG** + 180×180 apple icon; files exist in `out/`; Google supports PNG/ICO, not SVG. |
| **R3** Weak Article schema (author "Adam", dates, no url) | **FIXED except image** | `src/lib/schema.ts:72-94`: `author @id`+name+url, ISO dates with `+04:00`, `url`, `mainEntityOfPage` object, `isPartOf`, `publisher`; visible byline "By Adam Ahsan" (`writing/[slug]/page.tsx:84`). Still no `image` property (needs per-article assets — Optional). |
| **R4** About page lacked full name / facts / profiles | **FIXED (entity); partial depth** | H1 full name, role, Dubai, selected work, contact, GitHub/LinkedIn/X/Medium links with `rel="me"`, 5 visible Q&A answers (`about/page.tsx:49-77,104-107,120-160,182-195`). Still no experience timeline/education/photo (content decision, owner facts). |
| **R5** Sitemap had no `<lastmod>` | **PARTIAL — new accuracy risk** | 10/10 entries now have `lastmod`, but **7 static URLs share one constant** `CONTENT_UPDATED` (`sitemap.ts:8,14,20,26,32,38,44`); Google uses `lastmod` only if consistently/verifiably accurate, so a synthetic constant can be ignored or distrusted. Fix in §5-1. |
| **R6** 5 fonts / 141 KB preloaded; unused Oswald | **FIXED (Oswald)** | `layout.tsx:18-40` now 4 families / 119,632 B (−15.2%). Optional further: Geist is only referenced by legacy/legal CSS yet still preloads 29,288 B (§5-4). |
| **R7** Homepage thin metadata/copy | **FIXED** | Title 20 chars with name, description 89 chars with name/role, +94 chars visible copy, explicit "This is bruh.ae — the portfolio of Adam Ahsan…" (`page.tsx:40-42`), name linked to `/about` (`page.tsx:35`). |
| **R8** One abstract OG image on all routes | **PARTIAL** | Default card replaced by branded name/role/site card, 866,349→42,310 B (−95.1%), name-bearing alt on all routes; per-route cards still pending (plan SEO-012 "in progress") — needs design assets. |
| **R9** GA4 misses SPA pageviews / no env gate | **OPEN** | `src/app/layout.tsx:72-83` unchanged: one `gtag('config')` per full load, loads in dev too. Measurement-only; privacy/consent decision is open in the plan decision log. See §5-5. |
| **R10** 5 MB orphan PNG deployed | **FIXED** | Deleted; `out/images` 18.98 MB→1.31 MB; `/images/hero/landing_screen_background.png` absent from build. |
| **R11** `_routes.json` 32 rules → 100-rule cap | **FIXED** | 11 clean include rules (`out/_routes.json`), generator guard `MAX_ROUTE_RULES = 90` + throw (`scripts/generate-markdown.mjs:9,148-152`); ~89 more pages before the cap. |
| **R12** Stale plan/decision conflict vs new name/Dubai goal | **FIXED** | `SEO_IMPLEMENTATION_PLAN.md` updated 2026-11-01 (Phase 6, next task = deploy + owner actions); decision log now records "Public identity is **Adam Ahsan**…", "Dubai/UAE positioning is allowed", Cloudflare robots, GA decision pending (`SEO_IMPLEMENTATION_PLAN.md:574-577`). |

---

## 4. Remaining findings after the change

### Required (small, code-only)

1. **Sitemap `lastmod` accuracy (R5 residual).** `src/app/sitemap.ts:8` defines one `siteUpdated` used for 7 URLs at lines 14, 20, 26, 32, 38, 44. Google's guidance: `lastmod` is used only when consistently and verifiably accurate; `priority`/`changefreq` are ignored. Options: (a) track per-page update dates in `src/lib/site.ts` and use them, (b) keep real post dates and **omit** `lastModified` on static pages, (c) leave as-is and accept likely ignored. Also remove `changeFrequency`/`priority` (lines 15-16, 21-22, 27-28, 33-34, 39-40, 45-46, 51-52) — harmless but ignored noise.
2. **Thin index titles.** `/about` 18 chars, `/contact` 20, `/projects` 21, `/writing` 23 — the root template already appends "— Adam Ahsan", so these render as vague descriptors ("About — Adam Ahsan"), which Google's title-link best practices advise against. Enrich the base titles without duplicating the name (details §5-2).
3. **Dangling `@id` references.** `isPartOf { "@id": "https://bruh.ae/#website" }` appears in `src/lib/schema.ts:91` (Article), `src/lib/schema.ts:107` (ProfilePage), and `src/app/projects/[slug]/page.tsx:47,59` (SoftwareApplication/CreativeWork), but those pages do **not** define a `WebSite` node in their graph. Article `publisher` (`schema.ts:92`) references `#person` while the full Person node is only defined on `/` and `/about` (the inline author has name+url, which mitigates it). Fix: include a small `WebSite` node (and/or the full `Person` node) in each page graph, or drop `isPartOf` — details §5-3.
4. **GA4 SPA pageviews + environment gate** (measurement; `src/app/layout.tsx:72-83`). One `gtag('config')` runs only on full page load, so App Router client-side navigations are not recorded as page views; the tag also loads in `next dev`. Fix requires a small client component using `usePathname` (or `send_page_view:false` + manual events) and a `process.env.NODE_ENV === 'production'` guard — but a privacy/consent decision is still open (decision log), so this may be intentionally deferred. §5-5.

### Optional

5. **Article JSON-LD has no `image`.** Google's Article recommendations include a representative, crawlable image (≥50K px², 16:9/4:3/1:1) — not a logo/brand card. Requires per-article images (content/assets, not code-only). Do not substitute the generic social card.
6. **Single shared OG image** for all routes; per-route cards would help social CTR/brand but need design assets (plan SEO-012 still in progress).
7. **Geist still preloads 29,288 B on every page** even though current routes only reference `--font-geist-sans` via legacy CSS and the `legal-article` rules used by the `noindex` privacy page. `preload: false` on `layout.tsx:24-28` would cut the preload set to 90,344 B (−24.5% of remaining) with the font still loading where used (§5-4).
8. **RSC `.txt` mirrors remain crawlable:** `out/index.txt`, `out/about.txt`, `out/projects/qeemat.txt`, `out/__next._head.txt`, per-directory payloads all build as `text/plain`; `_headers` now noindexes `/_markdown/*` only. They are unlinked/un-sitemapped and needed for client navigation, so risk is low — if desired, generate explicit `_headers` noindex entries for the RSC payloads (owner Transform Rule alternative).
9. **`llms.txt` page labels carry the site suffix** ("About — Adam Ahsan", "Qeemat: … — Adam Ahsan") because `scripts/generate-markdown.mjs:201-202` uses `document.title`; polish only. `llms-full.txt` (52 KB) is a machine-readable full-text duplicate of all pages including the noindex privacy page; Google states it does not use llms.txt ([AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)) so this is an AI-surface decision, not a Google SEO issue. `/_markdown/*` `X-Robots-Tag: noindex` is Google-safe and does not block AI fetches.
10. **robots.txt production drift remains an owner action** — source now documents it; the actual AI-crawler policy is set in Cloudflare (owner decision).
11. **Article date display edge case (Nit):** schema uses `YYYY-MM-DDT00:00:00+04:00` (`schema.ts:86-87`) while the visible date formats the date-only string in UTC (`writing/[slug]/page.tsx` `formatDate`). For UTC users the ISO instant is the previous day 20:00Z; if you want date-only precision, use `T12:00:00+04:00` or store a real publication time.
12. **404 title (Nit):** still falls back to the layout default "Adam Ahsan — bruh.ae"; acceptable, `noindex` retained.
13. **No BreadcrumbList/ItemList/Organization** (optional; breadcrumbs only render on desktop per Google's current docs).

---

## 5. Top 5 cheap fixes worth doing before/with deployment (Lead implements)

| # | Fix | File:line | Change | SEO impact | Risk | Effort |
|---|---|---|---|---|---|---|
| 1 | Sitemap lastmod accuracy + drop ignored fields | `src/app/sitemap.ts:8,14-52` | Use real per-route dates (extend `src/lib/site.ts` with page dates) or omit `lastModified` for static pages while keeping post `updatedAt`; delete `changeFrequency`/`priority` | Keeps Google's only used sitemap signal (`lastmod`) trustworthy; removes misleading constants | Low | S (~15 min) |
| 2 | Enrich the four thin index titles (template appends the name, so don't duplicate it) | `src/app/about/page.tsx:8`, `src/app/contact/page.tsx:7`, `src/app/projects/page.tsx:10`, `src/app/writing/page.tsx:8` | e.g. `'About: Dubai Product & AI Builder'`, `'Contact & Collaboration'`, `'Projects: Layla AI, Qeemat & Experiments'`, `'Commentary: AI, Product & Luxury Essays'` → rendered 37–53 chars including "— Adam Ahsan" | Clearer title links/CTR; avoids vague-descriptor titles per Google's guidance | Low | S (~10 min) |
| 3 | Resolve dangling `@id` graph references | `src/lib/schema.ts:91,107`; `src/app/projects/[slug]/page.tsx:47,59` | Add a minimal `WebSite` node (`{"@type":"WebSite","@id":WEBSITE_ID,"url":SITE_URL,"name":PERSON_NAME}`) to the Article/ProfilePage/project graphs (and optionally the full Person node), or remove `isPartOf` | Cleaner structured-data graph; removes unresolved-reference validator warnings; no rich-result dependency | Low | S (~15 min) |
| 4 | Stop preloading the Geist family | `src/app/layout.tsx:24-28` | Add `preload: false` to the `Geist({...})` options (font stays available for legacy/legal CSS; verify privacy page) | −29,288 B preload on **every** page (119,632→90,344 B, −24.5%); removes an unused critical-path request | Low (visual check on `/track-my-salah-privacy-policy`) | XS (~5 min) |
| 5 | GA4: SPA `page_view` + production gate | `src/app/layout.tsx:72-83` | Guard with `process.env.NODE_ENV === 'production'`; add small client component that calls `gtag('event','page_view')` on `usePathname()` change (or `send_page_view:false` + manual events); consider `lazyOnload` to reduce LCP contention | Accurate SEO measurement for client-side navigation (no ranking effect); enables GSC/GA comparison after deploy | Low; **privacy/consent decision still open** (plan decision log) — if blocked, substitute #5 with BreadcrumbList JSON-LD on `projects/[slug]` and `writing/[slug]` (cheap, desktop-only rich result) | S (~20 min) |

**Deployment is the single biggest remaining step** — all of the above are small compared to getting the entity/name/schema delta live and verified.

---

## 6. Evaluated, not recommended now (judgement + rationale)

| Item | Verdict | Why |
|---|---|---|
| Article titles 62/64 chars (were 68–70) | **Leave** | Google truncates title links by width, not a hard char limit; the "— Adam Ahsan" suffix is now a deliberate entity signal. Revisit only if Search Console shows truncation/CTR loss on those queries. |
| `/writing` H1 "Yaps, and thoughts." → add name/topic | **Leave** | Title, description, `og:title`, intro ("Essays and commentary by Adam Ahsan…") and schema already carry name+topic; H1 is one of several title-link sources. Changing it costs brand voice for negligible SEO gain. |
| Per-route OG images | **Defer** | Big win already banked (branded name/role card, −95.1% bytes, name-bearing alt). Route cards need design assets; not "cheap/safe/in-scope" for this pass. |
| `/about` Q&A → add FAQPage JSON-LD | **Don't** | Google **deprecated and removed the FAQ rich result** (Search Central updates: May 2026 deprecation, June 2026 documentation removal — https://developers.google.com/search/updates). The visible Q&A already helps snippets/AI understanding; structured data is not required for generative-AI features (Google's AI guide). Keep the visible copy, skip the markup. |
| `ICO` favicon | **Not needed** | PNG 512×512 + apple icon now satisfy Google's favicon formats; `.ico` is legacy-browser polish only, no SEO effect. |
| `_headers` noindex for RSC `.txt` files | **Defer** | Unlinked, un-sitemapped, low discovery risk; wildcard syntax in Cloudflare `_headers` can't target mid-path patterns cleanly, so it would need generated per-file rules. Monitor crawl stats post-deploy instead. |
| `llms.txt` labels with "— Adam Ahsan" suffix | **Defer/polish** | AI-consumer readability only; no Google impact. Strip suffix in `pageListLine` if the generator is touched anyway. |
| Homepage visible copy | **No change needed** | Now 907 chars, names Adam Ahsan and bruh.ae, links name→/about, keeps the visual identity line. |
| Article `image` | **Open, asset-blocked** | Recommended for Article rich results, but requires relevant per-article images; the branded social card is not a valid substitute (Google: representative image, not logo). |
| GA production gate/consent | **Needs owner decision** | Privacy/consent decision logged as open; do not ship analytics changes without it. |

---

## 7. Must-verify after deploy (cannot be tested locally)

1. Redirect matrix from the slimmed `_routes.json`: `/about/`, `/about.html`, `/projects/qeemat/`, article `.html` still 308→clean; `/index.html`→`/`; `http`→`https`; `www`→apex — re-verify full www matrix (plan notes a transient Cloudflare 522 on `www.bruh.ae/about`).
2. Worker response layer: `Link` headers (markdown alternate + llms describedby + homepage site-description), 4 security headers, `Vary: Accept`; markdown negotiation still works for clean routes.
3. `_headers`: `/_markdown/*` returns `X-Robots-Tag: noindex` + markdown content type; `/_next/static/*` immutable; `site-description.jsonld` type.
4. `llms.txt` / `llms-full.txt` return 200; `/robots.txt` unchanged (Cloudflare-managed block + repo block).
5. Rich Results Test: `/`, `/about`, one article, `/projects/qeemat` (expect no critical errors; note dangling `@id` refs and missing Article `image` as non-critical); Schema Markup Validator for the graph.
6. PSI mobile+desktop (`/`, `/projects/layla-ai`) and Search Console URL Inspection + sitemap submission (owner actions from baseline still outstanding); CrUX/field data remains the only way to confirm CWV.

---

## 8. Caveats

- No Google Search Console index/query data, no GA4 data, no PSI/CrUX field-lab data in this re-audit — index status, real CWV and query performance are **unmeasured**; treat performance numbers as payload measurements, not CWV scores.
- Branch is **not deployed** (production verified still serving `Adam's Portfolio`, no Person JSON-LD, no PNG favicon, old `Link` headers). All "after" claims are local-build/source claims; edge behaviour of the worker, `_headers`, `_routes.json` and redirects needs a preview/production deploy.
- Local Brotli sizes (zlib q9) are not CDN-observed transfers; browser-loaded image bytes vary by viewport/DPR (e.g. Layla hero loads 900w or 1536w).
- The independent harness in this directory reports the same headline deltas (out/ −82.5%, images −93.1%, fonts −15.2%, Layla −90.5%, name-in-title 0→11); minor differences are rounding/method, not contradictions.
- Only this file was written; `out/` and tracked files were read-only.

---

## 9. Sources

- Google Search Central — Title links: https://developers.google.com/search/docs/appearance/title-link
- Google Search Central — Build and submit a sitemap (`priority`/`changefreq` ignored; `lastmod` advisory): https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central — Favicons in Search (supported formats: BMP/GIF/ICO/PNG/JPEG/PPM/TIFF): https://developers.google.com/search/docs/appearance/favicon-in-search
- Google Search Central — Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central — Profile page structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google Search Central — Site names: https://developers.google.com/search/docs/appearance/site-names
- Google Search Central — Optimizing for generative AI features (llms.txt not used; schema not required): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central — Search documentation updates (FAQ rich result deprecated May 2026 / doc removed June 2026): https://developers.google.com/search/updates
- Google Search Central — Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Cloudflare — Pages Functions routing / `_routes.json` limits: https://developers.cloudflare.com/pages/functions/routing/
- Cloudflare — Serving Pages (heads/caching/redirects/404): https://developers.cloudflare.com/pages/configuration/serving-pages/
- Cloudflare — Managed robots.txt / Content Signals: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
- Cloudflare — Crawler Hints / IndexNow: https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/
