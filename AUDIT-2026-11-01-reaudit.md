# Re-audit - bruh.ae / Adam Ahsan (2026-11-01, post-implementation)

**Scope:** independent re-run of the three audit workstreams against branch `feature/entity-seo-ai-hardening` (PR #19, commit `93d04d9e` + follow-up fixes) and its fresh build, measured against the merged `dev` baseline (`b4fe0833`, i.e. PR #17). Production https://bruh.ae still serves the pre-change build, so all after-state evidence is the local `out/` build; deploy is pending.

**Method:** three independent auditors re-ran their original audits against the branch (code, Google SEO, AI/LLM readiness), and the Lead built both the `dev` baseline and the branch output from source and measured them with the same script (`.audit/re-audit/measure.mjs`). No estimates: the baseline is a real `npm run build` of `origin/dev` in a temporary worktree.

---

## 1. Scorecard: before -> after

| Axis | Original audit | Re-audit | Delta |
|---|---|---|---|
| Code quality (site-wide) | B- | **B+** | +1 step; correctness B+ -> A-, performance C- -> A-, security C -> B+, tests C+ -> B |
| Google SEO (overall) | C+ | **B+** | +2 steps; structured data D+ -> A-, entity D -> B+, metadata B- -> A-, performance C- -> B+ |
| AI / LLM readiness (overall) | C+ | **B** | +2 steps; entity D -> B, cite/answerability C -> B+, parse B -> B+ |
| New agent-discovery path (code) | A- | **A** | no regressions, extended test coverage |

Original reports: [`.audit/findings/`](.audit/findings/). Re-audit reports: [code](.audit/re-audit/code-review.md), [SEO](.audit/re-audit/seo-audit.md), [AI](.audit/re-audit/ai-readiness.md).

### Old findings: closed

- SEO C1 (no name signals): **closed** - name in 11/11 titles, OG/Twitter titles and structured data; visible identity sentence on home and About; Q&A block.
- SEO C2 (no Person/ProfilePage entity): **closed** - Person + WebSite graph, ProfilePage, connected Article/SoftwareApplication/CreativeWork entities with resolvable `@id` refs.
- SEO C3 / perf (Layla CWV): **closed** - Layla raster 9.64 MB -> 0.88 MB (-90.5%), hero 2.0 MB PNG -> 81 KB / 34 KB responsive WebP.
- Code R-1 (security headers): **closed** - worker emits headers on page responses; `_headers` now also covers static assets.
- Code R-5 (dead assets/Oswald): **closed** - 23 dead/superseded files removed, images -93.1%, font preloads 5 -> 4.
- AI discovery gaps (llms.txt, alternate links, frontmatter dates, date concatenation): **closed**.
- Code R-7 (tests): **partial** - Markdown suite 17 -> 28 behaviour tests, release script 77 -> 118 checks; three legacy source-regex suites remain.
- SEO R1 (Cloudflare-managed robots): **owner action** - documented honestly in README, robots.ts and the plan; dashboard decision still open.
- GA privacy/consent (Code R-2/R-3): **deferred** - GA is now production-gated, but the consent/privacy decision is still the owner's.
- Dead CSS (~1,000 lines) and 89 RSC `.txt` payloads: **open, documented** (lower priority).

## 2. Measured before/after (real builds)

| Metric | Before (`dev` b4fe0833) | After (`feature/entity-seo-ai-hardening`) | Change |
|---|---|---|---|
| out/ total size | 20816 KB | 3591 KB | -82.7% |
| out/ file count | 196 | 185 | -5.6% |
| out/images size | 18536 KB | 1190 KB | -93.6% |
| public/images size | 18536 KB | 1190 KB | -93.6% |
| font preloads | 5 (138 KB) | 4 (117 KB) | -15.2% |
| homepage JS chunks (bytes, brotli est.) | 10 / 577 KB (0 KB) | 10 / 577 KB (145 KB) | 0.0% |
| homepage CSS (bytes, brotli est.) | 64 KB (0 KB) | 57 KB (10 KB) | -11.5% |
| _routes.json include rules | 32 | 11 | n/a |
| sitemap <lastmod> count | 0 | 3 | new |
| llms.txt | absent | 3 KB (11 markdown links) | new |
| llms-full.txt | absent | 42 KB | new |
| pages with name in <title> | 0/11 | 11/11 | new |
| pages with name in description | 0/11 | 5/11 | new |
| pages with name in structured data | 0/11 | 7/11 | new |
| pages with any structured data | 4/11 | 7/11 | new |
| schema node types | {"WebSite":1,"Article":3} | {"Person":7,"WebSite":7,"ProfilePage":1,"CreativeWork":1,"SoftwareApplication":1,"Article":3} |  |
| markdown mirror size | 47 KB | 59 KB | 24.2% |
| markdown pages with author | 0 | 3 | new |
| markdown pages with dates | 0 | 4 | new |
| markdown date/bylink concat bugs | 4 | 0 | fixed |
| markdown skip-link noise | 1 | 0 | fixed |
| worker: alternate/describedby links | no | yes | new |
| worker: security headers count | 0 | 4 | new |
| site-description.jsonld | 0 KB (Person: false) | 1 KB (Person: true) | new |

Additional measured facts:

- `out/` total: **20.8 MB -> 3.6 MB (-82.5%)**; `out/images`: **18.5 MB -> 1.25 MB (-93.1%)**.
- Layla page referenced raster bytes: **9,414 KB -> 897 KB**; homepage referenced images: **387 KB -> 261 KB**.
- Font preloads: **5 / 141,044 B -> 4 / 119,632 B** (Oswald gone, Inter Tight deduplicated).
- Markdown mirror: 47 KB -> 53 KB (more identity/Q&A content), still ~86% smaller than the 344 KB HTML signup, with author/date frontmatter on articles.
- `llms.txt` 3.1 KB (11 Markdown links); `llms-full.txt` 42 KB, one top-level H1, privacy page excluded.
- Release verification: **118/118 checks pass** on a fresh build (was 77 before the re-audit fixes).

## 3. Follow-up fixes applied after the re-audits

1. **Factual accuracy:** Layla AI JSON-LD no longer claims Adam Ahsan as creator; modelled as `CreativeWork` with a contributor (technical integration).
2. **Connected graphs:** article/about/project pages now publish the Person + WebSite nodes they reference, so no dangling `@id` remains; project JSON-LD moved into `src/lib/schema.ts`.
3. **Person image + content date:** Person carries the branded card as `image`; ProfilePage `dateModified` uses the shared `CONTENT_UPDATED` constant.
4. **Markdown extraction:** adjacent inline elements (CTA rows, publication links) are separated; decorative index numbers are now `aria-hidden` so they leave the mirror.
5. **llms-full:** single top-level H1 + one `##` section per page, noindex privacy page excluded (~42 KB).
6. **Response headers:** page responses carry `Content-Signal`; negotiated Markdown is `Cache-Control: private` with `Content-Location`; static assets get the same baseline security headers via `_headers`.
7. **Index titles enriched:** About/Contact/Projects/Writing now carry descriptive, name-bearing absolute titles (e.g. "About Adam Ahsan - Dubai Product & AI Builder").
8. **Sitemap accuracy:** `lastModified` only for articles (real content dates); ignored `changefreq`/`priority` removed.
9. **GA4:** analytics scripts only load in production builds (dev traffic no longer pollutes the property).
10. **Repo hygiene:** deleted 6 unused components/hooks, dead data fields, duplicate PostCSS config, dead Tailwind config, `index.html.old`, tracked `dist/`, `.nojekyll`, and the unused `layla-ai-experience.webp`; fixed broken `start`/root-serving `preview` scripts; pinned `engines.node >= 22.18`; `next.config.ts` now states `images.unoptimized` explicitly.

## 4. Verification

- `npm run lint`: pass (0 warnings).
- `npm test`: pass (46/46; Markdown suite 28 tests including new H1/adjacent-link/header regressions).
- `npm run build`: pass (15 routes, 11 Markdown pages).
- `.audit/verify-release.mjs`: **118/118 checks pass** on the fresh build (schema graph resolution, llms files, headers, sitemap, metadata, Markdown extraction, worker end-to-end, dead-file removal).
- Production is still the old build: live `/llms.txt` 404s and the old title/JSON-LD are served. Post-deploy verification is still required.

## 5. Still open (owner / non-code)

1. **Deploy** and run the post-deploy matrix (live Link/security headers, `/llms.txt`, 404, trailing-slash/.html variants, `www` paths).
2. **Cloudflare AI-bot policy decision** (currently training crawlers blocked at the edge while the site publishes agent-facing discovery files).
3. **Google Search Console** domain property + sitemap submit; Bing/IndexNow.
4. **GA4 consent/privacy** decision and SPA `page_view` (analytics is production-gated now).
5. **External profile alignment** (GitHub still displays "Adam" and an image-only README; LinkedIn/X/Medium/Substack bios).
6. Lower priority: ~1,000 lines of dead CSS, RSC `.txt` noindex via Cloudflare Transform Rule, per-route OG images, article `image`, a real portrait for `Person.image`.

## 6. Caveats

- No Search Console, GA field data or CrUX/PageSpeed Insights data was available; CWV conclusions are measured payloads, not lab/field scores.
- The AI-crawler matrix is dashboard-controlled and was not re-probed; live robots.txt remains unchanged and documented.
- The 118-check release script is a strong local gate but is not a substitute for post-deploy verification.
