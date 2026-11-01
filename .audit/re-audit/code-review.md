# Re-audit delta — `feature/entity-seo-ai-hardening` (PR #19)

- **Re-auditor:** `code-reviewer` (shared task `task-8`), independent of the implementer
- **Branch:** `feature/entity-seo-ai-hardening` @ `93d04d9e` · 4 commits on baseline `d78003fc` (PR #17 merged) · clean tracked working tree
- **Commits:** `d19c67bd` entity graph/name metadata · `dba873ea` llms discovery + worker headers · `6d285479` image optimization · `93d04d9e` docs
- **Baseline:** my original review `.audit/findings/code-review.md` (B− site / A− agent path) + task-7 release verification (SHIP, 3 non-blocking items)
- **Build:** Lead-built fresh `out/` at 12:58, newer than the newest code source (12:37); inspected read-only, not touched. I did **not** re-run `npm run build` (Lead owns it); I did re-run lint/tests and independently validated the fresh output.
- **Writes:** only this file. No tracked file modified, nothing committed.

## Verdict: **Approve / ship** — strong positive delta, no regressions found

The four commits ship the entity/SEO/AI P0 set cleanly and close three of my six baseline Required items plus most of the metadata/performance Optional items. The remaining debt is **pre-existing**, not introduced here: dead code/config, GA/privacy, static-asset headers, generator output polish. The branch is ready; the five cheap fixes in §6 are worth taking in the same merge window.

## 1. Before → after scorecard

| Axis | Before (baseline review) | After (this re-audit) | Evidence for the change |
|---|---|---|---|
| **Correctness** | B+ | **A−** | `<title>` === `og:title` === `twitter:title` on 10/10 indexable pages (the task-7 R-1 defect is fixed); all JSON-LD blocks parse, entity graph/author/date/URL fields verified in fresh `out/`; 88/88 Lead release checks pass; remaining: Markdown adjacent-link concatenation (O-C). |
| **Readability / simplicity** | C+ | **B−** | New code is clean and commented (`src/lib/schema.ts` 120 lines, generator helpers named/documented), worker stays 43→59 lines. Old debt is untouched: 6 unused components/hooks (432 LOC), dead data fields, ~1,039 dead lines in `globals.css`, duplicate PostCSS/tailwind configs. |
| **Architecture** | B− | **B** | `src/lib/schema.ts` now centralizes Person/WebSite/Article/ProfilePage builders + `serializeJsonLd`; worker/generator boundary stays clean; `buildRoutes` has a documented 90-rule guard. New blemishes: inline `projectJsonLd` in a route, `PROFILE_URLS` data living in the schema module (O-A/O-B). |
| **Security** | C | **B+** | Worker now emits the 4 security headers on page responses (`cloudflare/markdown-worker.mjs:14-21,41-55`), verified end-to-end; `_headers` handles static assets (`public/_headers:1-9`); all 4 JSON-LD injection sites use `serializeJsonLd` escaping (grep-verified, no raw `JSON.stringify` into `dangerouslySetInnerHTML`); `target="_blank"` links retain `noopener noreferrer`. Remaining: GA4 consent/privacy (deferred), no CSP, no static-asset security headers, 89 RSC `.txt` payloads unguarded. |
| **Performance** | C− | **A−** | `out/` 3.57 MB/186 files; `out/images` 19 files/**1.25 MB** (was ~18.5 MB); Layla hero 2,000,931 B PNG → **81,458 B** (1536w) / **33,984 B** (900w) WebP; OG card 866,349 B → **42,310 B** @1200×630; 22 files removed; font preloads **5→4**, font media **25→21**, zero Oswald references in built HTML; Inter Tight now a single `next/font` instance (`src/app/layout.tsx:2,36-40`). Remaining: homepage JS still 577 KB/10 chunks; no image pipeline; `sizes` props still no-ops under `unoptimized`. |
| **Tests** | C+ | **B** | 44/44 tests pass (was 35), Markdown suite 17→**26** meaningful tests; the Lead's built-output acceptance script is committed and expanded 77→**88 checks**, now including a regression assertion for the fixed og/twitter-title bug (`.audit/verify-release.mjs:33-40`). Remaining: 3 source-text suites still hold 35 regex assertions; built-output script is **not wired into `npm test`/CI**; no `.github/workflows`. |
| **Overall** | **B−** | **B+** | Entity/AI path specifically: **A− → A** (correct, safe, tested, discoverable; three generator-polish gaps left). |

## 2. Baseline Required findings — fixed vs open (re-verified against HEAD)

| ID | Baseline finding | Status | Evidence |
|---|---|---|---|
| **R-1** | No security headers; `_headers` can't protect worker pages | **FIXED** | `cloudflare/markdown-worker.mjs:14-21,41-55`; fresh-build worker e2e: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` on page HTML+Markdown, absent on passthrough assets; `_headers` covers `_markdown/*` + immutable static (`public/_headers:1-9`). |
| **R-2** | GA4 unconditional + hard-coded ID | **DEFERRED (unchanged, documented)** | `src/app/layout.tsx:73-83` still renders in all envs; `src/lib/site.ts:11` hard-coded. Plan decision log records it as pending; audit owner action §7. Not a regression — explicitly deferred, needs an owner decision. |
| **R-3** | No site privacy/cookie disclosure | **DEFERRED (unchanged)** | Only the app-specific Track My Salah policy exists (`src/app/track-my-salah-privacy-policy/page.tsx`, noindex/unlinked). Tracked as owner action; legal decision. |
| **R-4** | Duplicate PostCSS, dead `tailwind.config.js`, redundant `autoprefixer`, broken scripts | **NOT FIXED** | `postcss.config.js:1-6` + `postcss.config.mjs:1-5` both present; `package.json:19` autoprefixer; `tailwind.config.js` still never loaded; `package.json:10` `start` invalid under `output: 'export'`; `:12` `preview` serves repo root; build deps still in `dependencies` (`:14-26`) vs runtime deps in `devDependencies` (`:27-32`). |
| **R-5** | 7.8 MB unreferenced images; unused Oswald preloaded | **FIXED** | 22 files deleted (`6d285479`); `out/images` 1.25 MB; no deleted filename appears in built HTML/source/tests/docs; font preloads 4; `out/index.html` has 0 "oswald" hits (verified). |
| **R-6** | Dead code: 432 LOC components, ~half `globals.css`, dead data fields | **NOT FIXED** | `TextCanvas.tsx` 210, `BrutalButton.tsx` 29, `Reveal.tsx` 34, `media/ProjectHero.tsx` 30, `hooks/useReveal.ts` 58, `hooks/useTheme.ts` 71 still have zero importers; `posts.ts:15,22,96-99,139-143,183-187` and `projects.ts:12-16,45-49,64-68` dead fields/`words`; `git diff d78003fc..HEAD -- src/app/globals.css` is empty (211/349 rules ≈1,039 lines still dead); residual `--font-oswald` dead var `globals.css:13` (now unresolved `--next-font-oswald`) used only by dead selectors `:664,717,1151`. |
| **R-7** | 9/35 tests assert source text; no built-output tests | **PARTIAL** | Markdown suite expanded (26 tests) and built-output acceptance script (88 checks) now committed — but source-regex suites remain (`homepage-identity.test.mjs`, `external-writing.test.mjs`, `layla-showcase.test.mjs`: 35 `assert.match`-style assertions), and neither `npm test` nor CI runs the built-output script. |

**Baseline Optional status:** O-1 title template **fixed** (`src/app/layout.tsx:44-46`, `src/lib/metadata.ts:37-39`); O-4 Inter Tight dedupe **fixed**; O-11 sitemap `lastmod` + project JSON-LD **fixed**; O-5 image pipeline **partial** (assets optimized, no pipeline; `sizes` still no-ops); O-8 stale docs **partial** (SEO plan/AUDIT updated, `PORTFOLIO_SPECIFICATION.md`/`ADAPTATION_PLAN.md`/`AINO_AGENCY_ANALYSIS.md` still describe an unbuilt architecture); O-9 Markdown polish **partial** (skip-link removed, `.md` content-type added; adjacent-link and llms H1 gaps remain); O-2 (project data split across 3 modules), O-3 (`GridProvider` ~18 unused CSS vars), O-6 (lint only `src`), O-7 (stale `index.html.old`/`dist/`/`.nojekyll`, 59.8 MB repo, no CI), O-10 (client hygiene nits) remain open.

## 3. Regressions introduced by the 4 commits

**None found.** Checks that would have caught regressions, all passing on the fresh build:

- Scope: exactly 4 focused commits (2 `feat`, 1 `perf`, 1 `docs`); no changes to `next.config.ts`, `package.json`, dependency graph, or unrelated components; `git status` clean; `git diff --check` clean.
- Metadata consistency: `<title>`/`og:title`/`twitter:title` identical on 10/10 indexable pages; titles 20–64 chars (no page >65; the "68+ char article" candidate is not triggered — the 71 counted raw includes `&#x27;` entities); unique titles/descriptions/canonicals; privacy `noindex, follow`; 404 `noindex`; one `<h1>` per page.
- Schema: Person `#person`/WebSite `#website` reused consistently on home, about, articles, project pages; ProfilePage `mainEntity`; Article author `@id`+name, `+04:00` dates, `url`/`mainEntityOfPage`/`isPartOf`; SoftwareApplication/CreativeWork on projects; `site-description.jsonld` still byte-equal to the homepage graph; every JSON-LD block parses; no raw `</script` in any block.
- Behaviour: generated worker hash unchanged from task-7 (`834DAED0…`), so negotiation/Link/header behaviour is the same verified path; compact e2e on fresh `out/` re-passes alternate+describedby Links, 4 security headers, `Vary`, HEAD, 404/asset passthrough; Lead script 88/88.
- Markup/CSS: article ledger/rail `<p>` conversions have matching CSS (`src/app/studio-pages.css:184,219-221,320`); About H1 role span (`:388`), FAQ (`:408-429,616-617`), `.studio-case-author`, `.signal-intro-note` are all defined and present in served CSS; no stale `span` selectors.
- Assets/links: 22 deletions have no dangling references; all internal `href`/`src` targets resolve; new WebP/PNG dimensions match declared data (hero 1536×1024/900×600, OG 1200×630, icons 512²/180²); grid `_routes.json` 11 clean routes.
- Accessibility of new About markup: heading order remains valid (h1 → sr-only h2 → h3; FAQ has an sr-only h2 labelling the `<dl>`); `<dl><div><dt><dd>` is valid HTML5; profile links carry descriptive text and `rel="noopener noreferrer me"`; byline is a real `<Link>`; no heading-text concatenation in the HTML (the H1 reads "Adam Ahsan The person behind all of it.").
- No dangling references to deleted assets in tracked docs/source/tests (grep over all tracked text files).

## 4. New / remaining findings (severity labels)

### Required (pre-existing debt, cheap enough for this window)
- **R-6 — Dead code/data + ~half of `globals.css` still dead** (details §2). Highest remaining readability tax; safe to remove in slices.
- **R-4 — Build config/scripts ambiguity** (details §2). `npm start` is broken by design under `output: 'export'`; `preview` serves the repo root rather than `out/`; two PostCSS configs and a never-loaded `tailwind.config.js` invite future mistakes.

### Optional
- **O-A (new, introduced by `d19c67bd`) — inline project JSON-LD breaks the new schema-module pattern.** `src/app/projects/[slug]/page.tsx:33-61` hand-builds `SoftwareApplication`/`CreativeWork` and imports `PERSON_ID`/`WEBSITE_ID`/`personReference`, while every other entity is built in `src/lib/schema.ts:14-112`. Expected: `createProjectNode({ slug, name, description })` in `schema.ts`, imported by the route (output unchanged). Why: one place owns schema/IDs; avoids divergence when a third project is added.
- **O-B (new) — content data lives in the schema module and presentation uses positional destructuring.** `src/lib/schema.ts:6-12` exports `PROFILE_URLS`; `src/app/contact/page.tsx:2,12` does `const [github, linkedin, x, medium] = PROFILE_URLS` (silently relies on array order). Expected: move profile URLs to `src/lib/site.ts` (content) and use explicit named fields in contact.
- **O-C — Markdown adjacent inline links concatenate.** `scripts/generate-markdown.mjs:62-66` (Turndown config) produces `out/_markdown/about.md:109` `[Get in touch](…)[GitHub ↗](…)[LinkedIn ↗](…)[X ↗](…)` and `out/_markdown/writing/how-a-tech-company-accidentally-becomes-political.md:99` `[Medium](…)[Substack](…)`. Agents/humans read them as one run. Expected: separate with blank lines/`·` via a Turndown rule or block wrappers. Only remaining defect found in the generated Markdown corpus.
- **O-D — `llms-full.txt` repeats an H1 per page.** `scripts/generate-markdown.mjs:207-213` emits `# <title>` + page body (which starts with its own `# …`) → 22 H1s across 11 sections in `out/llms-full.txt` (51.2 KB). Expected: one top H1 and `##` pages (or strip the body's leading H1). Cosmetic for agents; no data loss.
- **O-E — 89 Next RSC `.txt` payloads are served with no `X-Robots-Tag`** (`out/**/*.txt` excluding `llms.txt`/`llms-full.txt`; `public/_headers:1-9` has no rule). Low discoverability, but they are crawlable duplicate content and cheap insurance to noindex. Also the documented residual that **static assets get no security headers** (page responses only) — `public/_headers` could add the same 4 headers under `/*`.
- **Old O-3 — `ProfilePage.dateModified` hard-coded.** `src/lib/schema.ts:106` `'2026-11-01'` duplicates `CONTENT_UPDATED` in `src/lib/site.ts:12`; import the constant so the next content update can't drift.
- **Old Nit — `article:author` is a name, not a profile URL.** `src/lib/metadata.ts:59-65` emits `<meta property="article:author" content="Adam Ahsan">`; OG spec expects a profile URL (`https://bruh.ae/about`). Harmless for common consumers.
- **Doc drift (low):** committed `.audit/verification.md` is the pre-commit task-7 report and still lists the now-fixed og/twitter issue as open; a one-line "superseded by `.audit/re-audit/code-review.md`" avoids confusion. The `AUDIT-2026-11-01.md` §11 reference is fixed. `PORTFOLIO_SPECIFICATION.md` / `ADAPTATION_PLAN.md` / `AINO_AGENCY_ANALYSIS.md` remain materially stale (already flagged O-8).
- **Owner-content note (not a code defect):** `Person.jobTitle` "Product and AI builder", the FAQ answers, and the Dubai address are factual claims the owner should confirm/sign off (audit §7 owner action); don't treat them as verified because code ships them.
- **Minor asymmetry:** schema lists 5 profiles but contact links 4 (no Substack) and about 3; acceptable, worth a sentence if intentional.

## 5. Verification performed (evidence)

| Step | Result |
|---|---|
| `npm run lint` | PASS, exit 0 (`eslint src --max-warnings=0`). |
| Tests | **44/44 PASS** across 6 files. `npm test` wrapper still hits the sandbox `spawn EPERM` boundary, so I ran each file in-process (`node tests/<file>.test.mjs`): 2+1+6+26+5+4. |
| Fresh build | Lead-built `out/` at 12:58:30, newer than newest source 12:37:34; inspected read-only. My 39-check fresh-build audit passed 38/39 — the single "fail" is O-C (adjacent links, a real open polish issue, not a build error); worker hash equals the task-7 verified hash; Lead's `.audit/verify-release.mjs` now runs **88/88 PASS** including the new og/twitter-title regression check. |
| Out not touched | No writes to `out/`; no build/scripts run that regen build artifacts. |

## 6. Top-5 cheap, safe, in-scope fixes for this merge window (Lead implements)

| # | Fix | Exact location | Expected change | Risk | Effort |
|---|---|---|---|---|---|
| **1** | Delete the six unused components/hooks and dead data fields (keep CSS deletion as its own follow-up commit) | `src/components/TextCanvas.tsx` (210), `src/components/BrutalButton.tsx` (29), `src/components/Reveal.tsx` (34), `src/components/media/ProjectHero.tsx` (30), `src/hooks/useReveal.ts` (58), `src/hooks/useTheme.ts` (71); remove `words`/`image?`/`note?`/`icon?` from `src/lib/posts.ts:15,22,96-99,139-143,183-187` and `src/lib/projects.ts:12-16,45-49,64-68` | Zero-importer files and data removed; build/tests unchanged (grep-verified no importers) | Very low (unused; `npm run lint`/`build` cover it) | S |
| **2** | Separate adjacent links in generated Markdown | `scripts/generate-markdown.mjs:62-66` (after `new TurndownService(...)`) | Add a rule that inserts a blank line/` · ` between sibling anchors; `about.md:109` and the article publication line render as distinct links | Low (affects generated Markdown only; update the 26-test suite expectations) | S |
| **3** | Single-H1 structure in `llms-full.txt` | `scripts/generate-markdown.mjs:207-213` (`buildLlmsFullText`) | Emit one top H1 and `##` per page (or strip the page-leading H1); 22 H1 → 1 + 11 section headers | Low (content-only; re-run generator, inspect diff) | S |
| **4** | Static-asset header hardening in `_headers` | `public/_headers:1-9` | Add `X-Robots-Tag: noindex` for RSC `.txt` payloads, with `! X-Robots-Tag` detaches for `/llms.txt` and `/llms-full.txt`; add the 4 security headers under `/*` for static assets | Low–medium: verify rule precedence in a Pages preview (`curl -I`); avoid catching the llms files | S |
| **5** | Repair npm scripts + centralize the export image constraint | `package.json:10` (`"start": "next start"` → remove, or `npx serve out -l 3000`), `:12` (`preview` → serve `out/`, not `.`), `next.config.ts:3-6` (add `images: { unoptimized: true }`) | Scripts that work under `output: 'export'`; future `<Image>` usages cannot silently break the static export | Very low | S |

*(Runner-up, not in the five: move `projectJsonLd` into `src/lib/schema.ts` (O-A), use `CONTENT_UPDATED` in `src/lib/schema.ts:106`, and move `PROFILE_URLS` to `src/lib/site.ts` — all one-liners/small moves, safe after the above.)*

## 7. False-positive risks / unverified

- I did **not** re-run `npm run build` (Lead owns it); the fresh `out/` was trusted only after proving it is newer than every code source and re-verifying its content/behaviour independently. A future verification run should reproduce the build once to close that loop.
- Visual QA of the new About FAQ/CTA, hero `<picture>` and recompressed images was **not** performed (no browser this pass); the markup/CSS checks pass but a quick look at `/about` and `/projects/layla-ai` (desktop + 390 px) is worth doing before merge.
- O-D/O-C are cosmetic for consumers; Markdown parsers treat the concatenated links as separate links, so this is readability, not data corruption. Do not change content/titles to chase title length: max title is 64 chars (fine; SERP truncation is cosmetic).
- `_headers` `/*.txt` matching + `!` detach semantics must be validated in a Cloudflare preview — preview tooling is authoritative; rule ordering nuances apply.
- `X-Robots-Tag: noindex` on `_markdown/*` is intentional (mirrors are fetch targets, not search results); don't "fix" it.
- GA/privacy and the live Cloudflare AI-bot posture remain owner decisions; they are documented in the plan/audit and are not code regressions.
- Content facts (job title, FAQ answers, location) should be owner-confirmed; the code correctly renders what the data says.
- Live post-deploy checks (Link/security headers on bruh.ae, `llms.txt`, redirect matrix incl. `www`) remain outstanding — the branch is not deployed.

## 8. Bottom line

**Before: B− / A−** → **After: B+ / A**. The branch materially improves correctness (entity identity + social metadata + schema), security (worker headers, JSON-LD escaping), performance (18.5 MB → 1.25 MB images, 4 preloads), and test coverage (44 tests, 88-check acceptance script). No regressions were introduced. The five fixes above are all small, safe, and close the last quality gaps in the new surfaces; the remaining large debt (R-4/R-6/config/CI/GA) is pre-existing and should be a follow-up, not a merge blocker.
