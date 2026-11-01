# AI / LLM readiness audit — `bruh.ae` (Adam Ahsan)

- **Auditor:** ai-readiness-auditor (team task `task-3`)
- **Date:** 2026-11-01, Asia/Dubai
- **Subject:** `D:\Code\GitHub\portfolio` @ `feature/agent-link-discovery` (`d78003fc`), deployed to https://bruh.ae via Cloudflare Pages
- **Method:** source review (file:line), fresh `out/` inspection (build regenerated 11:12:51–11:12:57 GST; `_markdown/*.md` regenerated), unit-test reading, and live HTTP probes of production (Node `fetch`, spoofed `Accept`/`User-Agent`, ~11:05–11:25 GST). Fetched web facts are cited in [Sources](#sources); vendor docs are treated as data.
- **Caveats:** LinkedIn content is behind auth and was not verified; the Cloudflare dashboard for the `bruh.ae` zone is not accessible from this audit (observed behaviour only); Cloudflare may verify real bot IPs more strictly than spoofed UAs, so the UA matrix below is indicative, not proof of the full production policy; `web_fetch` truncated some vendor pages, so a few claims are marked “secondary source”.

---

## 0. Verdict and readiness scorecard

**Overall: C+.** The fetch/negotiation plumbing is genuinely strong and live-verified. The site is weak exactly where the owner’s goal is: (1) production discovery is being throttled by a Cloudflare-managed robots/edge policy that the repo does not show, and (2) there is almost no structured *entity* signal that tells an AI system who Adam Ahsan is or what bruh.ae is.

| Dimension | Grade | One-line verdict |
|---|---|---|
| **Discovery** (can AI find the right URLs?) | **C** | Sitemap good; robots.txt in the repo says allow-all but production blocks training crawlers; no `llms.txt`, no alternate-markdown links, no IndexNow. |
| **Fetch / negotiation** (can AI get clean content?) | **A−** | `Accept: text/markdown` works end-to-end live on every page; q-values, HEAD, `Vary`, ETags correct. Minor gaps vs Cloudflare’s 2026 standard (`X-Markdown-Tokens`, `Content-Signal`, alternate links). |
| **Parse / extraction** (is the Markdown clean?) | **B** | 86% smaller than HTML, absolute links, alt text, JSON-LD preserved. But frontmatter has no author/date, date strings are concatenated (`03July 16, 2026`), skip-links/index noise remain, project pages have no JSON-LD. |
| **Cite / answerability** (can a model answer questions?) | **C** | Rich prose and real dates exist, but the corpus never states “Adam Ahsan is…” or “bruh.ae is…”, has no Q&A/facts block, and most titles say only “Adam”. |
| **Entity** (does the web agree who Adam is?) | **D** | Full name appears once on the homepage and in no title/description/JSON-LD; no `Person`/`ProfilePage`; name collisions confirmed; GitHub profile name is “Adam” and its profile README is image-only. |
| **Measurement** (can the owner see AI impact?) | **D** | GA4 installed but no AI channel/referral measurement plan; Cloudflare AI Crawl Control is available but unused; no crawler logs/IndexNow; no citation-prompt baseline. |

---

## 1. Executive summary

1. **CRITICAL — production robots.txt and edge policy contradict the repo.** `src/app/robots.ts` emits allow-all, but https://bruh.ae/robots.txt is Cloudflare-managed: it prepends a `Content-Signal: search=yes,ai-train=no,use=reference` policy plus `Disallow: /` for GPTBot, ClaudeBot, CCBot, Bytespider, Amazonbot, cohere-ai, Google-Extended, meta-externalagent and others. Live probes match: **GPTBot / ClaudeBot / CCBot / Bytespider / Amazonbot / cohere-ai get HTTP 403**, while OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot and Bingbot get 200. So training-time knowledge is blocked while answer-time retrieval is allowed — a defensible posture, but it is currently a dashboard accident that the repo, README, and prior audits do not reflect.
2. **Already good and live-verified:** `Accept: text/markdown` returns `text/markdown; charset=utf-8` + `Vary: Accept` on `/`, `/about`, `/projects/qeemat`, `/projects/layla-ai`, `/writing/<slug>`; HTML is the default including `*/*`; q-values are respected; HEAD works; `/_worker.js` and `/_routes.json` are not exposed; unknown routes fall through to the HTML 404.
3. **The mirror is small and token-efficient:** 11 Markdown pages, **48,418 B total (≈12.1k tokens)** vs 344,696 B of HTML — an **86% reduction**. A capable agent can ingest the whole site for ~12k tokens, which is exactly why an `llms.txt` index is cheap.
4. **Frontmatter is the weakest extraction link:** only `title`, `description`, `url`; no `author`, `datePublished`, `dateModified`, `canonical`/`lastModified`. Dates are partly mangled by adjacent inline spans: `Commentary / 03July 16, 2026 / 5 min read`, `By Adam20265 min read`, and `20268 min read` on the writing index.
5. **Entity gap is the biggest strategic blocker.** `Adam Ahsan` appears once in visible body copy (`src/app/page.tsx:37`), never in `<title>`, `<meta description>`, or JSON-LD. Homepage JSON-LD is only `WebSite` (`src/app/page.tsx:18-22`); article JSON-LD names `"Adam"` with no `url`/`sameAs` (`src/app/writing/[slug]/page.tsx:53-70`); `/about` and both project pages have **no JSON-LD at all**. There is no `Person`, `ProfilePage`, `BreadcrumbList`, `isPartOf`, `CreativeWork` or FAQ entity graph.
6. **“bruh.ae” is nearly absent as text.** The brand marker only exists in URLs and the `BRUH` logo (nav, stripped from Markdown); no page sentence says “bruh.ae is Adam Ahsan’s portfolio”. A model asked *“What is bruh.ae?”* has almost nothing to quote.
7. **llms.txt is absent (404 for both `/llms.txt` and `/llms-full.txt`).** It is optional, not a Google lever (Google Search says it ignores it), but it is cheap optionality for coding/agent clients and exactly the right home for entity facts + Markdown entry points. Cloudflare’s own agent-readiness scan and Lighthouse’s agentic-browsing category now check it.
8. **Cloudflare now ships a native equivalent** of this feature — “Markdown for Agents” (announced 2026-02-12) returns `text/markdown`, `Vary: accept`, `X-Markdown-Tokens`, and `Content-Signal` headers. That validates the repo’s approach and gives a concrete header parity target.
9. **Cache poisoning risk is currently low but unguarded.** Page responses are `cf-cache-status: DYNAMIC` (Pages Functions are not cached) and `Vary: Accept` is set, so compliant caches separate variants. There is no defensive `Cache-Control` on the Markdown variant, though, so enabling a “Cache Everything”/APO rule later would let an intermediary cache Markdown under the clean URL and serve it to browsers.
10. **`_routes.json` has a growth cliff.** The build writes 3 rules per page (clean, trailing slash, `.html`) = 32 rules today. Cloudflare Pages caps `_routes.json` at 100 total rules, so the writing archive will hit the wall at roughly 33 pages unless the include list becomes wildcard-based.
11. **Unconventional-but-defensible options exist** — allow training crawlers (bold, goal-aligned), a public `/facts` press kit + `/facts.json` + controlled `llms.txt`, UTM-tagged links inside `llms.txt`, a “Who is Adam Ahsan?” Q&A page, and a `rel="me"`/`sameAs` mesh across GitHub/LinkedIn/X/Medium. Wikipedia/Wikidata self-creation is **risky and should not be attempted** without independent coverage.
12. **Measurement is effectively zero.** Plan: GA4 “AI Assistant” channel verification + custom channel-group fallback, Cloudflare AI Crawl Control (24h free metrics + Agent Readiness scan), IndexNow, and a monthly manual citation matrix. Referral data is a lower bound: AI apps often strip referrers and have misattributed traffic before.

---

## 2. What is already good (claims verified, not trusted)

| Claim (README, task, prior docs) | Verdict | Evidence |
|---|---|---|
| `Accept: text/markdown` serves Markdown at the same URL | **Verified live** | `/`, `/about`, `/projects/qeemat`, `/projects/layla-ai`, `/writing/quiet-death-saas-pricing-power` → 200 `text/markdown; charset=utf-8` |
| `Vary: Accept` | **Verified live** | `vary: Accept, accept-encoding` on negotiated page responses |
| HTML default incl. `*/*` | **Verified live** | `*/*` and browser Accept → `text/html` |
| q-values respected; Markdown wins ties when explicitly requested | **Verified live** | `text/markdown;q=0.5, text/html;q=0.9` → HTML; `text/html, text/markdown` → Markdown; `text/markdown;q=0` → HTML; `TEXT/MARKDOWN; charset=utf-8` → Markdown |
| HEAD supported | **Verified live** | `HEAD /about` + Markdown Accept → 200, Markdown Content-Type, empty body |
| Unknown routes / assets use normal Cloudflare handling | **Verified live** | `/does-not-exist` → 404 HTML; `/_worker.js` and `/_routes.json` → 404; `/_next/*` not routed through worker |
| Homepage advertises `/site-description.jsonld` via `Link: rel="describedby"` | **Verified live** | Header present on homepage HTML **and** Markdown responses; JSON-LD served `application/ld+json; charset=utf-8` (via `public/_headers`) |
| `site-description.jsonld` stays in sync with homepage WebSite JSON-LD | **Verified** | Generated in `scripts/generate-markdown.mjs:56-62`; 245 B live = exactly the WebSite node |
| Generated Markdown keeps headings, absolute links, alt text, JSON-LD | **Verified** | See `out/_markdown/**`; link absolutisation at `scripts/generate-markdown.mjs:16-19`; JSON-LD extraction at `:11-12`, appended at `:44`; article `.md` files do contain their `Article` JSON-LD block |
| Worker only runs for page URLs | **Verified** | `out/_routes.json` 32 include rules; `/_markdown/about.md` is a static asset; assets/404s bypass the worker |
| Tests cover negotiation, Vary, HEAD, validators, extraction | **Verified by reading** | `tests/markdown-negotiation.test.mjs:37-149`; Lead separately reports `npm test` 35/35 pass |

**Also good and worth keeping:** clean `<main>` extraction (no nav/footer/scripts), semantic `sr-only` headings inside `/about` survive extraction, meaningful image alt text is preserved, Markdown mirror is small, and the design’s “text-canvas” aesthetic does **not** hide text in a real `<canvas>` (0 `<canvas>` elements in exported HTML; `TextCanvas` is currently unused).

---

## 3. CRITICAL — production discovery is Cloudflare-managed, not repo-managed

**Severity: Critical.** This is the single most important finding; it invalidates the repo’s and README’s described discovery posture.

Evidence:

- Repo output: `out/robots.txt` = 61 B, from `src/app/robots.ts:6-14` — `User-agent: * / Allow: /` + sitemap.
- Production: `GET https://bruh.ae/robots.txt` returns 2,737 B beginning `# As a condition of accessing this website, you agree to abide by the following content signals:` then `# BEGIN Cloudflare Managed content` with:
  - `User-agent: *` / `Content-Signal: search=yes,ai-train=no,use=reference` / `Allow: /`
  - `Disallow: /` groups for Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, Diffbot, Google-Extended, GPTBot, omgili, anthropic-ai, Claude-Web, cohere-ai, MistralAI-Training, meta-externalagent, GoogleOther, Baiduspider, PetalBot, Awario bots, Google-CloudVertexBot, QualifiedBot, Cotoyogi, ICC-Crawler, atlassian-bot, FishBot, BorderxBot, NavuBot, SemrushBot-SWA, WARDBot, magpie-crawler, KimiBot, CitibotSiteCrawler.
  - `# END Cloudflare Managed Content`, then the repo’s `User-Agent: * Allow: / Sitemap:` block appended.
- Live UA matrix (spoofed UA, `Accept: */*`, `/about`): **403** for GPTBot, ClaudeBot, CCBot, Bytespider, Amazonbot, cohere-ai; **200** for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot, Bingbot, Applebot, DuckAssistBot, YouBot, GrokBot, MistralAI-User. (A 403 page = Cloudflare block page, 4,540 B.) Note: Applebot-Extended and Google-Extended are robots.txt *tokens*, not real HTTP UAs, so their 200 responses prove nothing.
- Cause per Cloudflare docs: **Bot Preference Sync** is enabled and the **Training** AI-bot policy is set to *Disallow*, which both prepends managed robots directives **and enables edge blocking for training-only AI crawlers**; “mixed-use crawlers are excluded from this edge block”. That exactly matches the observed split. Cloudflare also says managed content is prepended only when at least one policy is Block/Disallow; if every policy is set to allow, robots.txt is served unchanged.

Why it matters for the owner’s goal: base-model knowledge of “Adam Ahsan” is mostly built from training crawls (GPTBot, ClaudeBot, CCBot, Applebot-Extended, Google-Extended). Those are blocked **twice** (edge 403 and robots `Disallow`). Answer engines can still retrieve and cite the site (OAI-SearchBot/PerplexityBot allowed), so this is not fatal — but it removes the site’s own content from the long-term model-prior signal, which is the mechanism behind “the model already knows my name”.

Recommended action (owner must decide; both are legitimate):

- **Option A — goal-aligned (bold):** Cloudflare dashboard → zone `bruh.ae` → **Security Settings → Bot traffic → Configure AI bot policies** → set **Training** to **Allow** (Search/Agent remain Allow), then verify `robots.txt` loses the managed block and GPTBot/ClaudeBot/CCBot return 200. Document that choice in `README.md` and record it in the decision log. This maximises model-prior recall for a personal portfolio whose content is already public.
- **Option B — keep training blocked:** leave the dashboard as is, but **make the repo honest**: add a comment in `src/app/robots.ts`, a section in `README.md §Markdown for agents`, and a test/checklist note that production robots.txt is Cloudflare-managed and must be verified live after dashboard changes. Confirm answer-time bots stay allowed (they currently do).
- **Either way:** the repo’s `robots.ts` cannot override the managed block (specific `User-agent` groups beat `*`), so do not “fix” this in code alone. Also reconcile the contradictory signals: managed Content-Signal says `ai-train=no` while the team may add an `ai-train=yes` `Content-Signal` header (see §5) — pick one posture.
- **Verify:** repeat the UA matrix in §10 from an external network (spoofed UA is indicative only; the dashboard shows verified-bot decisions).

---

## 4. Discovery findings

### 4.1 llms.txt — absent; should exist (Optional, high leverage)

**Severity: Optional (recommended).** `https://bruh.ae/llms.txt` and `/llms-full.txt` both return the HTML 404 page. The llms.txt spec v2 (modified 2026-08-10) now explicitly recommends: an `/llms.txt` root file with an H1 + summary + curated link lists, **plus** `Link: rel="describedby"` pointing to it and `rel="alternate" type="text/markdown"` pointing at Markdown versions. Adoption is real (thousands of sites; Mintlify/GitBook/Yoast/Wix generate it; OpenAI/Anthropic/Google publish it for their own docs; Lighthouse’s Agentic Browsing category audits it), **but** consumption by major AI answer systems is unconfirmed, and Google’s 2026 AI-optimisation guidance says Google Search ignores it. Cloudflare’s own Agent Readiness scan checks it. Publish it for agent UX + optionality, never as a Google ranking lever.

**What it should contain for this site** (generated at build, not hand-maintained):

- Entity facts: `Adam Ahsan`, Dubai, UAE; builder working on AI products and software; currently/formerly technical lead on Layla AI (FACES app); creator of Qeemat (Android, local-first); writes commentary on AI and products; contact `dev.ajx@proton.me`; `sameAs` links (GitHub, LinkedIn, X, Medium).
- What the site is: “bruh.ae is Adam Ahsan’s personal portfolio: selected projects, commentary, and experiments.”
- Key pages with one-line descriptions and Markdown entry points: `/`, `/about`, `/projects`, `/projects/layla-ai`, `/projects/qeemat`, `/writing`, each article, `/contact`.
- `last updated` date and (optionally) token counts.
- An `## Optional` section for the privacy policy and older posts.

**Implementation note:** add generation to `scripts/generate-markdown.mjs` (after the route map, `:74-77`) or a `public/llms.txt` with a test asserting it lists every mapped page; then extend the worker’s `Link` header to include `</llms.txt>; rel="describedby"` (keep the JSON-LD describedby too — multiple `describedby` links are legal).

### 4.2 robots.txt / crawler policy — see §3 (Critical). Additional notes

- [Optional] Add explicit AI groups to `src/app/robots.ts` only if Cloudflare’s managed content is disabled; otherwise they are dead code. If training is allowed, consider explicit allow groups for GPTBot/OAI-SearchBot/ChatGPT-User/ClaudeBot/Claude-SearchBot/PerplexityBot/Google-Extended/Applebot-Extended/CCBot/Bytespider as an auditable, git-tracked statement of intent.
- [Optional] `Disallow: /_markdown/` is **not** recommended if you want agents to use the mirrors; instead see 4.6 for search-engine de-duplication.
- [Nit] `robots.ts` has no `host` directive (unnecessary for Google/Bing; only Yandex uses it).

### 4.3 Sitemap — good, but no `lastModified`

**Severity: Required (cheap freshness signal).** `src/app/sitemap.ts:8-45` lists 10 URLs with `changeFrequency`/`priority` but **no `lastModified`**, even though real dates exist (`src/lib/posts.ts:30-32`, `:105-107`, `:149-151`). Add `lastModified` from `post.updatedAt` for articles, a content date for projects, and a site-level `updatedAt` constant for static pages (Next `MetadataRoute.Sitemap` supports `lastModified`). Google treats `lastmod` with skepticism when inaccurate — use real content dates, not build time. The privacy page is correctly `noindex, follow` (`out/track-my-salah-privacy-policy.html`) and correctly absent from the sitemap.

### 4.4 JSON-LD entity graph — only a thin `WebSite` exists (Required)

Current state (verified in fresh `out/`):

- Homepage: one `WebSite` node (`src/app/page.tsx:18-22`) — `@id`, `url`, `name: "Adam's Portfolio"`, description, `inLanguage`. No person, no publisher, no `sameAs`.
- Articles: `Article` node (`src/app/writing/[slug]/page.tsx:53-70`) — good dates/headline; but `author: {"@type":"Person","name":"Adam"}` (no `@id`/`url`/`sameAs`) and `publisher: Organization "Adam's Portfolio"` (no logo/sameAs). `mainEntityOfPage` is a bare string.
- `/about`, `/projects`, `/projects/qeemat`, `/projects/layla-ai`: **no structured data at all** (counted 0 `ld+json` blocks in each exported HTML file).

Recommended graph (exact snippets; put a shared builder in `src/lib/entity.ts` and import where noted):

**a) Homepage — replace `src/app/page.tsx:18-22`:**

```ts
const siteEntityJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Adam Ahsan',
      url: SITE_URL,
      image: new URL(DEFAULT_SOCIAL_IMAGE, SITE_URL).href, // ideally a real portrait
      disambiguatingDescription: 'Dubai-based product and AI builder; creator of the Qeemat app and technical lead on the Layla AI assistant.',
      description: 'Adam Ahsan is a Dubai-based builder working on AI products and software.',
      jobTitle: 'Builder', // owner to confirm exact title
      address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
      knowsLanguage: 'en',
      knowsAbout: ['AI products', 'conversational commerce', 'product engineering', 'React Native', 'Next.js'],
      sameAs: [
        'https://github.com/AdamJeddy',
        'https://www.linkedin.com/in/adamahsan/',
        'https://x.com/A7damn',
        'https://medium.com/@uhdam',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Adam's Portfolio",
      alternateName: ['bruh.ae', 'Bruh'],
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
})
```

**b) `/about` — add JSON-LD with `ProfilePage` (main entity = Person `@id`):**

```ts
const aboutJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/about#page`,
  url: `${SITE_URL}/about`,
  name: 'About Adam Ahsan',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: { '@id': `${SITE_URL}/#person` },
  dateModified: '2026-11-01', // wire to a real content date
})
```

**c) Articles — patch `src/app/writing/[slug]/page.tsx:53-70`:** `author: {'@type':'Person','@id':`${SITE_URL}/#person`,name:'Adam Ahsan',url:`${SITE_URL}/about`}`; `publisher` → the Person/`Organization` with a `logo`; add `url`, `image`, `isPartOf: {'@id':`${SITE_URL}/#website`}`, and a `BreadcrumbList` (Home → Commentary → Article).

**d) Project pages — add `CreativeWork`/`SoftwareApplication` (`src/app/projects/[slug]/page.tsx:43-102`):** Qeemat = `SoftwareApplication` (`applicationCategory: 'UtilitiesApplication'`, `operatingSystem: 'Android'`, `author: {'@id': '#person'}`, `url`, `sameAs: ['https://github.com/AdamJeddy/Qeemat']`, `datePublished: '2026'`); Layla AI = `CreativeWork` with `contributor: {'@id': '#person'}`, `datePublished: '2025'`, and the Chalhoub press release as `sameAs`/citation. (Layla is an employer product — phrase as contribution, not ownership.)

**e) Collections —** `/projects` and `/writing` should carry `CollectionPage` + `ItemList` of their children, and nested pages a `BreadcrumbList`. This is what lets extraction quality stay high as the archive grows.

**f) `site-description.jsonld`** — today 245 B of pure `WebSite`. It is advertised on the homepage as the machine description of the site; it should carry `@graph` with Person + WebSite (`@id`-linked), not just the site node. The generator (`scripts/generate-markdown.mjs:56-62`) currently copies the homepage `WebSite` node verbatim; update it to emit the full graph.

### 4.5 Markdown discovery links — missing (Required, cheap)

There is no `<link rel="alternate" type="text/markdown">` in any exported HTML (0 matches) and no `Link: rel="alternate"` response header. The only discovery path is the README’s `curl` example. Per llms.txt v2, add to the worker (`cloudflare/markdown-worker.mjs:31-33`) for every page route:

```js
response.headers.append('Link', `<${pages[pathname]}>; rel="alternate"; type="text/markdown"`)
```

and, when `llms.txt` exists, `</llms.txt>; rel="describedby"` on all pages (keep the homepage JSON-LD describedby too). Because `/_markdown/<path>.md` is directly accessible and served `text/markdown` live, this is a well-formed alternate target. A static `<link>` in HTML is also possible but the header approach needs no page changes and also covers non-HTML responses.

### 4.6 Mirrors and RSC payloads are crawlable duplicates (Nit/Optional)

- `/_markdown/*.md` returns 200 `text/markdown` and is allowed by robots. Low duplicate risk (not linked, not in sitemap), but if you want to be tidy add a `_headers` rule: `/_markdown/*` → `X-Robots-Tag: noindex` (search engines only; AI fetchers still can read it).
- Next 16 static export also emits RSC payloads (`/index.txt`, `/about.txt`, `/writing/*.txt`, `__next.*.txt`, 9.9–26.8 KB each, `text/plain`). They contain serialised page data and are fetchable but unlinked; same `X-Robots-Tag: noindex` treatment is reasonable. No change needed for AI readiness.

### 4.7 IndexNow / search-engine distribution (Optional)

Bingbot is allowed live (200), and Copilot grounding depends on the Bing index. There is no IndexNow support today. Add a `public/<key>.txt` + a post-deploy POST to `https://api.indexnow.org/indexnow` listing the sitemap URLs (Bing, Yandex, Seznam, Naver share submissions; Google does not support it). Safe, cheap, and it keeps the Copilot path fresh.

---

## 5. Fetch, negotiation, caching and robustness

### 5.1 Accept parsing — correct for the important cases (verified live + tests)

`prefersMarkdown` (`cloudflare/markdown-worker.mjs:1-12`) lowercases, splits on `,` and `;`, validates q-values against the RFC 9110 grammar (`0–3` decimals), and treats missing/`0` Markdown as “no”. Verified live: browser Accept → HTML, `*/*` → HTML, explicit q preferences honoured, ties favour Markdown when requested, `text/markdown; charset=utf-8` and uppercase forms work. `text/html;q=0.9, text/markdown;q=0.5` correctly returns HTML. Tests at `tests/markdown-negotiation.test.mjs:49-67` cover the main matrix.

Gaps (all **Nit/Optional**): no `text/x-markdown` or `text/plain` variants; duplicate media ranges resolve to first occurrence; invalid q-values are treated as 0 rather than ignored (arguably fine); tie-breaking to Markdown is a deliberate, documented choice.

### 5.2 HEAD, 404/406, ETags

- HEAD: 200 + Markdown Content-Type + empty body (verified live). ✓
- 404: `/does-not-exist` with `Accept: text/markdown` returns the HTML 404 (`text/html`, `no-store`, `Vary: accept-encoding`). This is sane: unknown routes are not in `_routes.json`, so the worker never runs. A 406 is not needed because every known page has a Markdown variant. Mark this **already good**.
- ETags: the Markdown variant carries the asset’s weak ETag (`W/"b18d…"`), distinct from HTML; conditional requests/304 pass through (`tests/markdown-negotiation.test.mjs:81-98`). HTML page responses observed with no `ETag`/`Last-Modified` (`max-age=0, must-revalidate`) — a minor caching inefficiency, not an AI-readiness failure.
- Worker errors: `env.ASSETS.fetch` has no try/catch; an ASSETS 5xx is passed through with `Vary` added, and a thrown exception would surface as a Cloudflare 1101 error page. Static ASSETS make this unlikely; **Nit** (a bare `try { … } catch { return env.ASSETS.fetch(request) }` is cheap hardening).

### 5.3 Caching / cache-poisoning analysis (Required to document; Optional to harden)

- **Current Cloudflare behaviour:** page responses are `cf-cache-status: DYNAMIC` (Pages Functions responses are not cached by default), and `Cache-Control: public, max-age=0, must-revalidate`. `/_markdown/*.md` assets are cached under their own URL key (observed `DYNAMIC` on cold hits, likely cacheable later). Because the HTML and Markdown variants have **different asset URLs**, Cloudflare’s URL-only cache keys cannot collide. **There is no cache-poisoning exposure today.**
- **`Vary: Accept` is set** on negotiated responses (`cloudflare/markdown-worker.mjs:34-36`), which is correct for browser and compliant shared caches.
- **Residual risk:** Cloudflare’s CDN does not use `Vary` in its cache key (except encodings). If the owner ever enables “Cache Everything”/APO/a Cache Rule on page URLs, a shared cache could store the Markdown response under `/` and serve it to browser users. Harden now: when serving Markdown, set `Cache-Control: private, max-age=0, must-revalidate` (or `no-store`), and never enable Cache Everything on page URLs without a Worker-level cache key that includes the negotiated variant. This is a one-line change in the worker and should be called out in the README.
- **`Content-Location`** (`/_markdown/about.md`) on Markdown responses is worth adding for provenance; it tells caches/clients the canonical representation URL.

### 5.4 `_routes.json` semantics and the 100-rule cliff (Required)

`scripts/generate-markdown.mjs:65-77` emits `include` entries for each page: clean path, trailing-slash path, and `.html` path. Fresh build = **32 rules** for 11 pages. Cloudflare Pages documents: “You may have no more than 100 include/exclude rules combined; each rule may have no more than 100 characters.” At 3 rules/page the writing archive hits the cap at ~33 pages, and deploy-time routing failures are likely. Fix one of:

- `include: ['/*']` plus `exclude` entries for the static trees (`/_next/*`, `/images/*`, `/icons/*`, `/_markdown/*`, `/*.txt`) so only page URLs invoke the Function; the worker’s existing `Object.hasOwn(pages, pathname)` fall-through then serves the rest. Note the trade-off Cloudflare documents: once Functions exist, requests default to invoking the Function, and the free plan has a daily Pages-Functions allowance — the excludes keep real static traffic off that quota.
- or targeted wildcards (`['/', '/*.html', '/projects/*', '/writing/*', '/about', '/about/', '/contact', '/contact/']`) — wildcards match any number of segments, but exact paths still need explicit directory + trailing-slash forms.
- in both cases add a build-time guard that throws when the rule count approaches 100, and keep the current test assertion on `_routes.json` contents (`tests/markdown-negotiation.test.mjs:137-138`).

Trailing-slash handling itself is correct (`/about` and `/about/` both map; verified live).

### 5.5 Header parity with Cloudflare’s “Markdown for Agents” standard (Optional, differentiating)

Cloudflare’s native implementation (2026-02-12) returns: `content-type: text/markdown; charset=utf-8`, `vary: accept`, **`x-markdown-tokens: 725`**, and **`content-signal: ai-train=yes, search=yes, ai-input=yes`**, with `title` frontmatter. This repo has everything except the token count and content signal. Add at build time (embed a `{ path: tokenCount }` map next to `pages` in `_worker.js`; approximate chars/4 or add `gpt-tokenizer` as a devDependency) and set `X-Markdown-Tokens` on Markdown responses. `Content-Signal` must be reconciled with §3 (managed robots says `ai-train=no`; don’t send `ai-train=yes` while the edge blocks trainers). Updating `README.md:71` (“Token counts are omitted because no tokenizer is configured”) is part of the change.

### 5.6 Token cost (fresh build)

| Surface | Bytes | ≈Tokens (chars/4) |
|---|---:|---:|
| Whole Markdown mirror (11 pages) | 48,418 | ~12,100 |
| Homepage `index.md` | 1,914 | ~480 |
| `/about` | 1,943 | ~490 |
| `/projects/qeemat` | 2,017 | ~505 |
| `/projects/layla-ai` | 7,244 | ~1,810 |
| Longest article | 10,577 | ~2,640 |
| Privacy policy | 14,851 | ~3,710 |
| All exported HTML (same pages) | 344,696 | — (86% reduction vs Markdown) |

Costs are trivial; the privacy page is 31% of the mirror and is `noindex` — keep it out of `llms.txt`’s primary list (put it under Optional).

---

## 6. Extraction quality of generated Markdown (Required/Optional findings)

What works: `<main>`-only extraction, absolute `href`/`src`, alt text preserved, `sr-only` headings survive, JSON-LD appended per page that has it, decorative empty-alt images and hidden/script/style content removed (`scripts/generate-markdown.mjs:9-19`), headings/fences/lists configured (`:32-36`).

### 6.1 Frontmatter lacks author and dates (Required)

**Evidence:** every `out/_markdown/*.md` starts with only `title`, `description`, `url` (`scripts/generate-markdown.mjs:37-45`). Article JSON-LD already contains `datePublished`/`dateModified`; the `<time dateTime>` is in the article HTML (`src/app/writing/[slug]/page.tsx:85`). Fix: extend the generator to lift `Article.datePublished`/`dateModified` (and `author.name`) out of the JSON-LD it already collects, plus a fallback to `time[datetime]`, and emit:

```yaml
---
title: "…"
description: "…"
url: "https://bruh.ae/writing/…"
author: "Adam Ahsan"
datePublished: "2026-07-16"
dateModified: "2026-07-16"
site: "bruh.ae"
---
```

For static pages, add a maintained `CONTENT_UPDATED` constant (avoid build-time “today” — models and sitemaps punish fake freshness).

### 6.2 Dates are concatenated with neighbours (Required)

**Evidence:** `out/_markdown/writing/quiet-death-saas-pricing-power.md:9` → `Commentary / 03July 16, 2026 / 5 min read`; `:15` → `By Adam20265 min read`; `out/_markdown/writing.md:19` → `20268 min read`. Root cause: adjacent inline spans with no literal separator (`src/app/writing/[slug]/page.tsx:83-95`, `src/app/writing/page.tsx:33-36`). This is a factual-extraction bug — a model can read “03July” or “20268” as data. Fix in JSX (add literal ` · ` or ` / ` text between spans; better for human readers too) and add a regression assertion in `tests/markdown-negotiation.test.mjs` for a fixture with adjacent spans.

### 6.3 Skip-link and decorative-index noise (Optional/Nit)

- The accessibility skip link is extracted as `[Skip to selected work](https://bruh.ae/#selected-work)` (`out/_markdown/index.md:7`). Add a removal selector for skip links in `scripts/generate-markdown.mjs:13` (e.g. `[class*="skip"], [data-agent-hide]`).
- Orphan `01`/`02` index numbers appear as standalone lines (`out/_markdown/about.md:27`, `out/_markdown/projects/qeemat.md:50-60`). The clean fix is to mark purely decorative index spans `aria-hidden="true"` (the generator already removes those); if a span carries meaning, leave it.
- Layout labels (`Featured project`, `Product concept / Android`, `View project`) survive. Mostly harmless context; if desired, mark as `aria-hidden` where purely presentational.

### 6.4 Project pages have no structured data and no author framing

Qeemat and Layla AI are the strongest citable work, yet their HTML/Markdown contain no `CreativeWork`/`SoftwareApplication` and no `"Adam Ahsan"` author context. Add the JSON-LD in §4.4d and one visible sentence of authorship (“Built by Adam Ahsan” / “Technical integration led by Adam Ahsan”) so Markdown extraction can attribute credit.

### 6.5 The answerability gap (“Who is Adam Ahsan?” / “What is bruh.ae?”) (Required)

Current maximum extractable answer is thin: homepage Markdown says `Adam Ahsan` / `Dubai, UAE` / “A slice of my life.”; `/about` says “I’m Adam, based in Dubai…”. No page contains a self-contained declarative sentence with full name + role + focus, and no page explains the domain. Add, at minimum, one sentence like:

> “Adam Ahsan is a Dubai-based builder working on AI products and software, best known for leading technical integration of the Layla AI beauty assistant inside the FACES app and for building Qeemat, a local-first Android price tracker. bruh.ae is his personal portfolio: selected work, commentary, and experiments.”

Place it in visible copy and Markdown will follow automatically. Then add a short FAQ block (answerable in one sentence each): “Who is Adam Ahsan?”, “What is bruh.ae?”, “What has Adam built?”, “Where is Adam based?”, “How do I contact Adam?”. `FAQPage` JSON-LD is optional (Google restricts FAQ rich results, but LLM extractors read it fine); put the same Q&A as `<dl>/<h2>` content so the Markdown mirror carries it without schema.

### 6.6 Frontmatter format and JSON-LD placement (Nit)

The JSON-LD fenced code block is parseable but sits after body content and duplicates the homepage `WebSite` node on `index.md`. Fine; if you add dates/authors to frontmatter, consider moving JSON-LD to a frontmatter field (`jsonLd: |`) or leaving as-is — low priority.

### 6.7 Extraction completeness spot checks (passed)

All 11 pages have `<main>` content + canonical URLs and generate without throwing; article bodies, Layla case-study sections, numeric impact claims and outbound citations survive; no canvas-only content exists on current routes, so there is no visually-hidden-content failure mode.

---

## 7. Entity strategy for “Adam Ahsan”, “bruh.ae”, “bruh”, “Adam”

### 7.1 Reality check on name collisions

- `web_search("Adam Ahsan")` returns unrelated people/profiles (e.g. a Contra designer profile, an artist “Ahsan in Dubai”) and **no bruh.ae**; the Lead independently confirmed collisions (Booksie/Wikimedia-style profiles) and absence. So the task is **disambiguation + first-party authority**, not ranking for a unique name.
- `/about` currently says only “Adam” (`src/app/about/page.tsx:74`); `/contact` exposes email + GitHub + LinkedIn but not X or Medium; nav brand `BRUH` (`src/components/layout/Nav.tsx:103`) is outside `<main>` and therefore absent from Markdown; the site never says “bruh.ae is…”.
- Realistic targets: **“Adam Ahsan”** (exact, disambiguated), **“Adam Ahsan Dubai”**, **“bruh.ae”** (unique), **“Adam Ahsan portfolio/developer/builder”**. Bare **“Adam”** is not winnable and should not drive design; “bruh” is a generic dictionary word — target the domain form.

### 7.2 Cross-web consistency audit (verified facts)

| Profile | Verified state | Recommended change | Label |
|---|---|---|---|
| GitHub `github.com/AdamJeddy` | API: login AdamJeddy, `name: "Adam"`, `blog: "Bruh.ae"`, `location: "Dubai, UAE"`, `bio: "To infinity and beyond"`, 41 public repos, 62 followers, created 2019, **twitter_username null** | Set display name **Adam Ahsan**; add a text profile README (it is currently **image-only** — banners/metrics, zero name/role text); set X handle; pin `portfolio` + `Qeemat`; add portfolio/`bruh.ae` links | Safe |
| LinkedIn `linkedin.com/in/adamahsan/` | Linked from `/contact` (`src/app/contact/page.tsx:50`) and footer (`src/components/layout/Footer.tsx:31`); content not verified (auth wall) | Align headline/About with the same one-liner; add GitHub/X/`bruh.ae` links; correct canonical name spelling | Safe |
| X `@A7damn` | Only in metadata (`src/lib/site.ts:4`, `src/app/layout.tsx:56`); no visible/sameAs link on site; X profile not verified | Display name **Adam Ahsan**, bio with `bruh.ae`, pinned intro post; add X to `/contact`, footer and `sameAs`; X blocks many crawlers, so value is entity-mesh not crawl | Safe |
| Medium `@uhdam` | 3 article source links (`src/lib/posts.ts:33,108,152`); profile name not verified | Set Medium bio/name to Adam Ahsan, link `bruh.ae`; keep cross-post canonicals pointing home | Safe |
| `bruh.ae` | Site title `"Adam's Portfolio"`; meta creator `"Adam"` (`src/app/layout.tsx:53`); Twitter creator `@A7damn` | Title/description should include **Adam Ahsan** and **bruh.ae** once each; add the entity sentence | Required |
| Wikidata / Wikipedia | No item/article | **Do not self-create.** Wikipedia: “Avoid writing or editing an article about yourself”; notability requires significant independent coverage. Wikidata: do not create an item about yourself unless notability criteria are met; it does allow editing an existing item and permits the subject’s own site as a reference for self-facts | Risky |
| Google Knowledge Panel | No evidence of a panel | cannot be forced; comes from entity reconciliation via consistent facts + authoritative independent sources; claim it if it appears; `sameAs` graph is the best controllable input | Safe, outcome not guaranteed |

### 7.3 Schema/entity fixes (the controllable core)

1. **Person + WebSite graph on the homepage** (§4.4a), with `sameAs` mesh, `disambiguatingDescription`, Dubai address (city/country only — no street), and a real portrait if one exists (the current social image is abstract, which weakens person entity association). Use `Person` `@id` everywhere else.
2. **ProfilePage on `/about`** (§4.4b) and a rewritten About page: H1 → “Adam Ahsan”, lead → the one-sentence definition, add a facts block (`<dl>`: Location, Focus, Current work, Selected work, Contact, Profiles), plus “last updated”. Keep the existing dossier visual language; the current dossier rail is `aria-hidden` and therefore already stripped from Markdown, so only the new facts need care.
3. **Article author** → Person `@id` (`"Adam Ahsan"`), `publisher` with logo, `isPartOf`, `BreadcrumbList` (§4.4c). Also add visible “By Adam Ahsan” in the article rail (`src/app/writing/[slug]/page.tsx:92-96`) instead of bare “By Adam”.
4. **Project pages** → `SoftwareApplication`/`CreativeWork` with author/contributor (§4.4d) and a visible authorship line.
5. **`/facts` page + `/facts.json` + press kit** (Safe/bold): canonical one-liner, short bio (50/150/400 words), role, location, focus areas, selected work, headshot, contact, profile links, “last verified” date. Every consumer — LLM, journalist, conference bio — benefits; the Markdown mirror covers it for free.
6. **`rel="me"`** on outbound profile links (footer/contact) and reciprocal links on profiles: cheap, standards-based identity unification (IndieAuth/Mastodon use it; other parsers can too).
7. **`alternateName`/`disambiguatingDescription`** on Person and WebSite; consider a short, non-defensive line on `/about`: “This is the portfolio of Adam Ahsan, a Dubai-based builder — if you’re looking for someone else with the same name, the profiles above identify this one.”

### 7.4 Unconventional tactics (owner invited “unconventional”; risk-labelled)

| Tactic | Label | Rationale / risk |
|---|---|---|
| **Allow AI training crawlers** (flip Cloudflare Training policy to Allow; set `Content-Signal: search=yes,ai-input=yes,ai-train=yes` consistently) | **Bold** | Directly targets long-term model-prior recall for a personal portfolio whose content is already public. Risk: content reuse/plagiarism; mitigate with clear attribution links in Markdown mirrors. Legal: robots/Content-Signal are preference signals, not a licence grant by themselves. |
| **Agent packs:** `/llms.txt` + `/llms-full.txt` + `/facts` + `/facts.json` + `rel=alternate`/`describedby` links | **Safe (slightly unconventional in 2026)** | Cheap, standards-aligned, high answerability leverage; low risk of harm. |
| **UTM-tagged links inside `llms.txt`** (`?utm_source=llms&utm_medium=ai`) and in the `/facts` press kit | **Bold** | This is the one surface you control, so it can produce the only reliable “agent → site” attribution. Risk: duplicate-URL bookkeeping in analytics; canonical tags keep SEO clean. Do not UTM-tag the canonical page URLs themselves. |
| **Serve Markdown automatically to AI-crawler User-Agents** (in addition to Accept) | **Bold / avoid for search bots** | Could bypass clients that don’t negotiate. Risk: looks like user-agent-based content serving; never do it for Googlebot/Bingbot (cloaking), and `Vary: User-Agent` is ignored by Cloudflare’s cache. Prefer Accept + advertised alternate links. |
| **“Who is Adam Ahsan?” Q&A page** with one-sentence answers and FAQPage JSON-LD | **Safe** | Directly matches model queries; no policy risk (Google may not show FAQ rich results, LLMs still read it). |
| **Public “now/changelog” page** with dated updates | **Safe** | Recency and “what is he doing now” answers; feeds model freshness. |
| **Earned third-party mentions**: podcast transcripts/pages, conference bios, guest posts with author bio, Dev.to/Hashnode cross-posts with canonical | **Bold but safe** | Strongest durable entity signal because it is independent; slow, requires real activity. Avoid paid link schemes. |
| **Buy name-variant domains/handles** (e.g. `adamahsan.com`, matching social handles) and 301 to `bruh.ae` | **Bold** | Low cost, catches typo/name queries. Risk: cost/upkeep; never buy a domain that is someone else’s active identity, and avoid trademarked names. |
| **Answer platforms (Quora/Reddit/HN) self-answers about “Who is Adam Ahsan?”** | **Risky** | Usually deleted/flagged as self-promotion; can damage reputation. Only participate genuinely in AI/product discussions, with disclosure. |
| **Wikidata item / Wikipedia article self-created** | **Risky** | Wikipedia: don’t write about yourself; notability needs significant independent coverage → likely deletion/COI block. Wikidata: don’t create an item about yourself unless notable. Could burn the real option later. |
| **Paid PR wires / paid “about” placements** | **Risky** | Manufactured sources are low-trust and can violate search spam policies; weak effect on models. |
| **Paid search ads for your own name** | **Bold** | Guarantees a visible result for “Adam Ahsan” queries and can be labelled, but does not create AI-answer citations and may look like competing with namesakes; low budget test only. |

---

## 8. Measurement plan (concrete, low cost)

**Baseline now (no code):**
1. **GA4:** confirm the property has the new **“AI Assistant” default channel group** (GA4 added it; check Admin → Data display → Channel groups, or Traffic acquisition report). If unavailable, create a custom channel group with source regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|meta\.ai|grok\.com|chat\.deepseek\.com|you\.com`. Do **not** add these as referral exclusions (that would hide them) — check the current unwanted-referral list.
2. **Cloudflare AI Crawl Control** (free): enable/monitor Overview + Crawlers + Metrics (24h window on free) + Directives tabs. It shows which AI crawlers are allowed/blocked and which paths they hit — the honest crawler-side view; run the **Agent Readiness** scan (isitagentready.com) monthly.
3. **Search engines:** submit sitemap in Google Search Console and Bing Webmaster Tools; enable IndexNow post-deploy; watch GSC for query impressions on “Adam Ahsan”/“bruh.ae”, and Bing’s AI/Copilot reporting where available.
4. **Citation matrix (the actual KPI for this goal):** once a month ask each of ChatGPT (search mode), Perplexity, Gemini, Copilot, Claude: *“Who is Adam Ahsan?”*, *“What is bruh.ae?”*, *“Adam Ahsan Dubai developer”*, *“Adam Ahsan portfolio”*. Record: cited? which URL? which facts? wrong person? Store alongside this audit (e.g. `.audit/ai-visibility/2026-11.md`). Non-deterministic — run 2 prompts × 2 sessions and record a range.
5. **Referral/landing-page proxies:** after adding UTM-tagged links in `llms.txt` and the facts page, those sessions are identifiable; also track `/facts`, `/about`, `/now` as landing pages (AI-referred sessions often land on the specific factual page).

**Caveats to state in any reporting:** AI apps frequently strip referrers or open in-app browsers → sessions appear `Direct`/`Unassigned`; OpenAI has had referral-misclassification bugs (ChatGPT traffic classified as direct in Oct 2025); UTM parameters are not preserved in model citations, so referral and UTM data are **lower bounds** and cannot measure unseen citations. Treat the citation matrix + crawler logs as the primary signal, analytics as secondary.

**Optional worker-side counting (Bold):** add a Workers Analytics Engine binding and write one data point per request (`pathname`, negotiated `format`, `Accept`, `User-Agent`, `cf.country`), then query it — gives exact crawler/variant traffic without paid Logpush. Worth it only if Cloudflare AI Crawl Control’s 24h window is insufficient.

**Suggested targets:** 4 weeks — robots/edge posture fixed, `llms.txt` + `alternate` links live, isitagentready scan passes Markdown negotiation; 8–12 weeks — Cloudflare shows OAI-SearchBot/PerplexityBot/Claude-SearchBot crawling all key pages, and ≥1 manual citation for “Adam Ahsan Dubai”; 6 months — consistent answer for “Who is Adam Ahsan?” across 4/5 assistants with the site cited; Knowledge Panel is a bonus, not a target.

---

## 9. Prioritized top 10

| # | Severity | Action | Where / effort |
|---|---|---|---|
| 1 | **Critical** | Decide and fix the production AI-bot posture (currently Cloudflare blocks training crawlers while repo says allow-all). Make the repo/README reflect reality or flip Training to Allow and document the choice. | Cloudflare dashboard + `README.md`, `src/app/robots.ts` comment. 10 min + decision. |
| 2 | **Required** | Add `Person` + `WebSite` graph with `sameAs`, `disambiguatingDescription`, Dubai address; fix `site-description.jsonld` to emit the graph. | `src/app/page.tsx:18-22`, new `src/lib/entity.ts`, `scripts/generate-markdown.mjs:56-62`. ~2 h. |
| 3 | **Required** | Create build-generated `/llms.txt` (+ optional `llms-full.txt`) with entity facts and Markdown entry points; advertise via `Link: rel="describedby"` and add `rel="alternate"` for Markdown. | `scripts/generate-markdown.mjs:74-77`, `cloudflare/markdown-worker.mjs:31-36`, `tests/`. ~2 h. |
| 4 | **Required** | Rewrite `/about` (H1 = Adam Ahsan, one-sentence definition, facts `<dl>`, links, updated date) and add the “bruh.ae is…” sentence to the homepage; add a 5-question Q&A. | `src/app/about/page.tsx`, `src/app/page.tsx`. ~2 h. |
| 5 | **Required** | Frontmatter author/dates + fix adjacent-span date concatenation (`03July`, `By Adam20265`, `20268`); add `lastModified` to sitemap. | `scripts/generate-markdown.mjs:37-45`, `src/app/writing/[slug]/page.tsx:83-96`, `src/app/writing/page.tsx:33-36`, `src/app/sitemap.ts`. ~1.5 h. |
| 6 | **Required** | Add JSON-LD to `/about` (ProfilePage), project pages (CreativeWork/SoftwareApplication), articles (author `@id`, publisher, isPartOf, breadcrumb), collections (CollectionPage/ItemList). | page files; ~2–3 h. |
| 7 | **Required (future)** | Fix `_routes.json` growth before the archive hits the 100-rule cap; add build-time guard. | `scripts/generate-markdown.mjs:65-77`. ~30 min. |
| 8 | **Required** | Measure: verify GA4 “AI Assistant” channel, enable Cloudflare AI Crawl Control + Agent Readiness scan, IndexNow, and start the monthly citation matrix. | ops. ~1 h setup + 15 min/month. |
| 9 | **Required** | External consistency: GitHub name/README/X handle, LinkedIn headline/About, Medium bio, `rel="me"` links; add X/Medium to `/contact`. | external profiles + `src/app/contact/page.tsx`, `Footer.tsx`. ~1 h. |
| 10 | **Optional** | Parse/fetch polish: `X-Markdown-Tokens`, `Content-Signal`, `Content-Location`, defensive `Cache-Control` on Markdown variant, skip-link/index-number cleanup, noindex for `_markdown`/`.txt` mirrors. | worker + generator + tests. ~2 h. |

---

## 10. How to verify after fixes (copy-paste)

```bash
curl -sI -H 'Accept: text/markdown' https://bruh.ae/about   # 200, text/markdown; charset=utf-8, vary: Accept, x-markdown-tokens
curl -s -H 'Accept: text/markdown' https://bruh.ae/writing/quiet-death-saas-pricing-power | head -20  # author/date frontmatter
curl -s https://bruh.ae/llms.txt | head                     # entity facts + curated page list
curl -sI https://bruh.ae/ | grep -i '^link'                 # describedby -> llms.txt + site-description.jsonld; alternate -> markdown
curl -s https://bruh.ae/ | grep -o '"@type":"Person"'       # also check ProfilePage on /about, SoftwareApplication on /projects/qeemat
for ua in 'GPTBot/1.2' 'OAI-SearchBot/1.4' 'ClaudeBot/1.0' 'Claude-SearchBot/1.0' 'PerplexityBot/1.0' 'CCBot/2.0' 'Bytespider' 'Googlebot/2.1' 'bingbot/2.0'; do
  printf '%-22s ' "$ua"; curl -s -o /dev/null -w '%{http_code}\n' -A "Mozilla/5.0 (compatible; $ua)" https://bruh.ae/about
done   # UA spoof is indicative only; confirm the authoritative policy in the Cloudflare dashboard
# plus: scan https://bruh.ae at https://isitagentready.com/ and via Cloudflare AI Crawl Control -> Directives -> Agent Readiness
```

---

## 11. Conflicts with earlier planning documents (flag, do not silently override)

- `SEO_IMPLEMENTATION_PLAN.md:88-89` — “Public identity: `Adam`; … A fuller public name is intentionally deferred.” `:100-101` and `:253-270` — “Person/ProfilePage schema remains deferred until a fuller name is chosen.” The owner has now explicitly asked for “Adam Ahsan” to surface, and the homepage already displays “Adam Ahsan” + “Dubai, UAE” (`src/app/page.tsx:37`). **Recommendation:** update the decision log (`:535-541`, entry dated 2026-07-16) and SEO-020 with the new decision, then implement §4.4.
- `SEO_IMPLEMENTATION_PLAN.md:541` — “Do not use Dubai/UAE positioning.” This conflicts with the current homepage identifiers and with any Person `address`/location facts. Decide one identity stance (location is already public on-page) and record it.
- `AINO_AGENCY_ANALYSIS.md:142` claims the site has “`application/ld+json` with Organization schema” — **false** in the current build (only `WebSite` + `Article`). Treat that document as aspirational for schema, per the task brief.
- `README.md:54-85` is accurate about negotiation but silent about the Cloudflare-managed robots/edge policy, the 100-rule ceiling and the missing alternate/llms.txt discovery. Update it as part of items 1–3.

---

## 12. Sources (external facts)

- Cloudflare — robots.txt setting / managed robots.txt, Bot Preference Sync, Content Signals, Training=Disallow → edge blocking: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
- Cloudflare — AI Crawl Control get started (free 24h metrics, UA-based detection, Agent Readiness): https://developers.cloudflare.com/ai-crawl-control/get-started/
- Cloudflare — AI Crawl Control Directives (robots.txt requests/violations, Agent Readiness scan via isitagentready.com): https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/
- Cloudflare — Pages Functions routing and limits (“no more than 100 include/exclude rules combined; each rule ≤100 characters”; wildcard semantics; fail-open/closed): https://developers.cloudflare.com/pages/functions/routing/
- Cloudflare — “Markdown for Agents” (2026-02-12; `text/markdown`, `Vary: accept`, `X-Markdown-Tokens`, `Content-Signal`): https://developers.cloudflare.com/changelog/post/2026-02-12-markdown-for-agents/
- Is your site agent-ready? (Cloudflare scan: robots, sitemap, Link headers, markdown negotiation, Content Signals, MCP/OAuth/commerce): https://isitagentready.com/
- llms.txt v2 spec (2024-09-03, modified 2026-08-10; `rel="alternate" type="text/markdown"`, `rel="describedby"` → llms.txt): https://llmstxt.org/
- llms.txt evidence summary (Google ignores it; adoption statistics; coding-agent usage): https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo-geo/references/llmstxt-evidence.md
- Google — AI features / generative-AI optimisation guidance (Google Search ignores llms.txt/machine-readable files; content is what matters): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google — crawler overview (robots.txt compliance, caching/ETag): https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers
- Google — common crawlers, `Google-Extended` token scope (training + Gemini grounding; does not affect Google Search inclusion/ranking): https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- OpenAI — crawler overview (`OAI-SearchBot` search, `GPTBot` training, `ChatGPT-User` user-triggered): https://developers.openai.com/api/docs/bots
- Anthropic — ClaudeBot / Claude-User / Claude-SearchBot and robots.txt behaviour: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity — crawler docs (`PerplexityBot` search, `Perplexity-User` user-triggered, WAF notes): https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- IndexNow protocol documentation: https://www.indexnow.org/documentation
- Wikipedia — Autobiographies (“Avoid writing or editing an article about yourself”): https://en.wikipedia.org/wiki/Wikipedia:Autobiographies
- Wikipedia — Notability (people): https://en.wikipedia.org/wiki/Wikipedia:Notability_(people)
- Wikidata — Autobiography (“do not create an item about yourself unless … notability criteria”): https://www.wikidata.org/wiki/Wikidata:Autobiography
- Wikidata — Notability: https://www.wikidata.org/wiki/Wikidata:Notability
- GA4 “AI Assistant” default channel group coverage: https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/
- AI-referral measurement/attribution caveats and misclassification precedent: https://www.tapclicks.com/blog/how-to-track-ai-referral-traffic-and-fix-your-marketing-attribution-in-2026 ; https://marketing4ecommerce.net/en/error-traffic-chatgpt/

---

## 13. Evidence appendix (live observations, 2026-11-01)

`GET /` no Accept → 200 HTML, `vary: Accept, accept-encoding`, describedby `Link`, `cf-cache-status: DYNAMIC`; Markdown Accept → 200 `text/markdown`, 1,913 B, ETag `W/"bffd…"`; `HEAD /about` Markdown → 200 empty body. Other pages 1,938–10,577 B Markdown; `/_markdown/about.md` direct → 200 Markdown; `/_worker.js`/`_routes.json` → 404; `/does-not-exist` Markdown Accept → 404 HTML `no-store`; `/site-description.jsonld` → 245 B `WebSite` only; `/llms.txt` → 404; `/robots.txt` → 2,737 B managed + repo block. GitHub API: `name: "Adam"`, `blog: "Bruh.ae"`, Dubai/UAE, `twitter_username: null`, 41 repos, 62 followers; README image-only. Fresh build: `_routes.json` 32 rules, `_worker.js` 4,274 B, `_markdown` 11 files / 48,418 B, regenerated 11:12:51–11:12:57 GST.
