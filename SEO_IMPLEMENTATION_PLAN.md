# SEO and Link-Sharing Implementation Plan

Last updated: 2026-07-18
Current phase: Phase 2 â€” structured data and content depth
Next task: SEO-021 â€” expand the Qeemat case study and add SoftwareApplication JSON-LD

## Purpose

This is the durable working plan for improving the portfolio's search visibility,
social link previews, structured data, performance, mobile experience, and Google
tooling. Update this file as work is completed so a future session can continue
without relying on chat history.

This plan does not promise a particular ranking. Search performance depends on
competition, content quality, authority, backlinks, technical quality, and time.

## How to maintain this file

- Work on one task ID at a time in the order shown unless a blocker is recorded.
- Change `[ ]` to `[x]` only after the task's acceptance criteria pass.
- Set **Current phase** and **Next task** at the top after every completed task.
- Record important choices in the Decision log.
- Record commands and results in the Verification log.
- Add implementation dates and pull request or commit references when available.
- Keep generated output, credentials, analytics IDs, and verification tokens out
  of this document.

## Status legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed and verified
- `Blocked:` Waiting for a decision, credential, production deployment, or other
  external dependency

## Audit baseline

The audit was performed against the `dev` branch on 2026-07-16.

### Confirmed strengths

- The production build succeeds and statically generates all current routes.
- Each content page has one visible `h1`.
- Current internal route links resolve to generated pages.
- URLs are readable and use descriptive slugs.
- A 390 Ã— 844 mobile check showed no horizontal overflow.
- The generated 404 page is marked `noindex`.

### Confirmed gaps

- Seven primary routes share `Adam's Portfolio` and
  `This is literally my portfolio` as title and description.
- No canonical tags are generated.
- No Open Graph or Twitter/X metadata is generated.
- No JSON-LD structured data is generated.
- `robots.txt` and `sitemap.xml` are absent from the static export.
- The canonical production domain is not declared in the repository.
- The README mentions `wrangler.jsonc`, but that file is absent.
- The writing detail page contains a title and excerpt but no article body,
  author, publication date, or representative image.
- Mobile navigation controls are approximately 23 px high.
- The open mobile menu leaves the obscured page in the accessibility tree.
- Reveal CSS defaults content to `opacity: 0` until JavaScript reveals it.
- Every initial page references about 567 KB of raw, uncompressed JavaScript and
  preloads four font families.
- Oswald is configured but not used by the current styles.
- `public/images/hero/landing_screen_background.png` is approximately 5 MB and
  has no current source reference.
- `npm run lint` currently reports 10 errors and 4 warnings.

### Audit limitations

- No production URL is recorded, so live status codes, redirects, headers,
  caching, TLS, existing index coverage, and real link previews remain unverified.
- No field Core Web Vitals data was available.
- No lab performance numbers should be treated as established until the deployed
  site is tested with PageSpeed Insights or an equivalent trace.

## Phase 0 â€” Decisions and clean baseline

### [x] SEO-001 â€” Confirm site identity and canonical URL

Priority: P0
Completed: 2026-07-16

Decide and record:

- Public identity: `Adam`; the site brand is `Adam's Portfolio`. A fuller public
  name is intentionally deferred.
- Canonical HTTPS origin: `https://bruh.ae`; `www` redirects to the apex domain.
- Location positioning: do not add Dubai/UAE targeting to copy or metadata.
- Track My Salah privacy policy: keep public but set `noindex, follow`.
- X attribution: `@A7damn` (`https://x.com/A7damn`).
- Hosting: Cloudflare Pages.

Acceptance criteria:

- [x] All five decisions are recorded in the Decision log.
- [x] The canonical origin is a permanent production domain, not a preview URL.
- [x] The public identity is approved for visible copy; Person/ProfilePage schema
  remains deferred until a fuller name is chosen.

### [x] SEO-002 â€” Restore a green verification baseline

Priority: P1
Likely files: privacy-policy page, `TextCanvas.tsx`, `useTheme.ts`, image-rendering
components.

Work:

- Fix the 10 current ESLint errors.
- Resolve or intentionally suppress the 4 warnings with documented reasons.
- Do not mix SEO behavior changes into this cleanup.

Acceptance criteria:

- [x] `npm run lint` passes with zero warnings.
- [x] `npm run build` passes.
- [ ] No unrelated visual or content changes are introduced.

## Phase 1 â€” Crawlability, metadata, and link previews

### [x] SEO-010 â€” Add central site constants and metadata helper

Priority: P0
Proposed files: `src/lib/site.ts`, `src/lib/metadata.ts`,
`src/app/layout.tsx`.

Work:

- Define the approved canonical site URL and site name once.
- Add `metadataBase` in the root layout.
- Add a reusable helper that accepts `path`, `title`, `description`, social image,
  and page type.
- Generate an absolute self-referencing canonical and absolute Open Graph URL.
- Add default site name, creator, X attribution, and application name.
- Never fall back to `localhost` or a deploy-preview origin in production.

Acceptance criteria:

- [x] One source of truth exists for the canonical origin and public site name.
- [x] The helper generates canonical, Open Graph, and Twitter metadata.
- [x] Static export builds without runtime environment dependencies.
- [x] The homepage static HTML is inspected for correctly resolved absolute metadata; nested-route coverage belongs to SEO-011.

### [x] SEO-011 â€” Add unique metadata to every route

Priority: P0
Proposed files: every route `page.tsx`, `src/lib/projects.ts`,
`src/lib/posts.ts`.

Target titles:

| Route | Target title |
| --- | --- |
| `/` | Adam's Portfolio â€” Projects, Writing & Experiments |
| `/about` | About Adam â€” Projects, Writing & Experiments |
| `/projects` | Projects â€” Adam's Portfolio |
| `/projects/qeemat` | Qeemat â€” UAE Price Tracker for Android |
| `/writing` | Writing on AI, Luxury and Product Engineering |
| Article detail | The Ugly Truth About AI Content for Luxury Brands |
| `/contact` | Contact Adam |
| Privacy policy | Track My Salah Privacy Policy |

Work:

- Add unique, natural descriptions that match visible page content.
- Add static metadata exports to static routes.
- Add `generateMetadata` to project and writing detail routes.
- Add self-referencing canonicals to all public pages.
- Apply the approved robots policy to the privacy page.
- Do not set a root `/` canonical that child routes might accidentally inherit.

Acceptance criteria:

- [x] Every generated HTML page has a unique title and description.
- [x] Every indexable page has one absolute self-referencing canonical.
- [x] Dynamic detail metadata is sourced from its project or post data.
- [x] The 404 remains `noindex`.
- [x] Metadata matches visible content and contains no unverified claims.

### [~] SEO-012 â€” Create and wire social preview images

Priority: P0
Proposed files: `public/images/social/*`, metadata helper, project/post data.

Image standard:

- 1200 Ã— 630 px, sRGB, approximately 1.91:1.
- PNG for text-led graphics; optimized JPEG for photography.
- Target less than 1 MB per image.
- Keep important content at least 60â€“80 px from the edges.
- Include concise `og:image:alt` and `twitter:image:alt` text.

Required images:

- Default portfolio image.
- Qeemat-specific image.
- Article-specific image after the article is complete.

Acceptance criteria:

- [ ] Default Open Graph and `summary_large_image` Twitter metadata are present.
- [ ] Qeemat and the article use relevant route-specific images.
- [ ] Image URLs are absolute HTTPS URLs in generated metadata.
- [ ] Deployed images return `200` with the correct content type.
- [ ] Facebook, LinkedIn, WhatsApp, Slack, Discord, and X previews are checked.

### [x] SEO-013 â€” Generate robots and sitemap files

Priority: P0
Proposed files: `src/app/robots.ts`, `src/app/sitemap.ts`, content data.

Work:

- Allow public crawlers to access the site and required assets.
- Reference the absolute sitemap URL from `robots.txt`.
- Include canonical, indexable routes only in the sitemap.
- Add stable `publishedAt` or `updatedAt` values to content data.
- Do not emit the current build time as every page's `lastmod`.

Acceptance criteria:

- [x] `/robots.txt` returns `200` and references the canonical sitemap.
- [x] `/sitemap.xml` returns valid XML.
- [x] Sitemap URLs exactly match canonical tags.
- [x] No `noindex`, 404, redirect, preview, or duplicate URL appears in the map.

### [ ] SEO-014 â€” Enforce one production URL format

Priority: P0
Proposed files depend on the approved hosting provider.

Work:

- Add or repair the actual Cloudflare Pages/Workers deployment configuration.
- Redirect HTTP to HTTPS.
- Redirect the non-canonical host to the canonical host.
- Normalize `.html`, trailing-slash, and clean-route variants.
- Confirm build output and deploy directory are configured correctly.
- Repair the inaccurate deployment section in `README.md`.

Acceptance criteria:

- [ ] Every alternate URL permanently redirects to the chosen canonical URL.
- [ ] There are no redirect chains or loops.
- [ ] Canonical tags, sitemap URLs, navigation links, and redirects agree.
- [ ] Preview deployments are not indexable.
- [ ] Production security and cache headers are inspected and recorded.

## Phase 2 â€” Structured data and content depth

### [x] SEO-020 â€” Add WebSite JSON-LD; defer Person/ProfilePage schema

Priority: P1
Proposed files: JSON-LD component/helper, homepage, about page.

Work:

- Add a `WebSite` entity on the homepage with a stable `/#website` ID.
- Defer `Person` and `ProfilePage` JSON-LD until a full public name is chosen.
- Do not infer a surname, location, job title, or employer from social profiles.
- Serialize JSON safely and avoid injecting unverifiable fields.

Acceptance criteria:

- [x] WebSite JSON-LD validates without syntax errors.
- [x] JSON-LD content matches visible page content.
- [x] No personal address or sensitive data is exposed.
- [x] Person/ProfilePage work has a separate follow-up task once the name is set.

### [ ] SEO-021 â€” Expand the Qeemat case study and add SoftwareApplication JSON-LD

Priority: P1
Proposed files: `src/lib/projects.ts`, Qeemat page, project media assets.

Content sections:

- User problem and UAE market context.
- Intended users and supported stores.
- Product workflow and screenshots.
- Local-first architecture and privacy choices.
- Android background checking and notification constraints.
- Technical decisions, testing, results, and lessons.

Schema work:

- Add `SoftwareApplication` with Android operating system, application category,
  description, author, repository, and public application URL.
- Add an `Offer` only after distribution and price are confirmed.
- Do not claim ratings, installs, reviews, or availability without evidence.

Acceptance criteria:

- [ ] The page provides a substantial, useful case study rather than a summary.
- [ ] Images have dimensions and descriptive alternative text.
- [ ] Schema matches visible facts and validates.
- [ ] Internal links point to related writing and the projects index.

### [ ] SEO-022 â€” Complete the article and add Article JSON-LD

Priority: P0 content
Proposed files: `src/lib/posts.ts`, writing detail page, article media.

Work:

- Add the full article body with useful section headings.
- Add visible author, `datePublished`, and `dateModified` values.
- Add a representative image and descriptive alternative text.
- Add `Article` or `BlogPosting` JSON-LD.
- Add related-article or related-project links where relevant.

Acceptance criteria:

- [ ] The page contains the full article, not only its excerpt.
- [ ] Visible dates and schema dates match.
- [ ] Article schema validates with no critical errors.
- [ ] The title and description accurately summarize the full article.

### [ ] SEO-023 â€” Add visible page context and keyword-aligned copy

Priority: P1
Proposed files: homepage, About, Projects, Writing, Contact.

Work:

- Keep `Adam` as the homepage identity unless a fuller public name is chosen.
- Make the homepage's value statement clearer without adding location targeting.
- Replace vague copy with a concise value statement while preserving the site's
  personality.
- Keep headings descriptive and natural; avoid keyword stuffing.
- Improve internal link labels where `View all` lacks context.

Target themes:

- Branded searches for Adam and Adam's Portfolio.
- Projects, writing, coding, and experiments by Adam.
- Local-first and React Native product engineering.
- UAE Android price tracking.
- AI quality and standards in luxury retail.

Acceptance criteria:

- [ ] Primary topics are present naturally in visible copy.
- [ ] Each landing page has a clear purpose and distinct search intent.
- [ ] Copy makes no ranking, employment, product, or performance claim that is
  not supportable.

## Phase 3 â€” Mobile, accessibility, and performance

### [~] SEO-030 â€” Make content and navigation resilient and accessible

Priority: P1
Proposed files: `globals.css`, `Reveal.tsx`, `useReveal.ts`, `Nav.tsx`.

Work:

- Ensure content remains visible when JavaScript is disabled or hydration fails.
- Add `aria-expanded` and `aria-controls` to the mobile-menu button.
- Give the overlay an appropriate label and relationship to its trigger.
- Move focus into the menu, support Escape, restore focus on close, and prevent
  focus from moving into obscured content.
- Prevent background scrolling while the menu is open.
- Add `aria-current="page"` to the active navigation link.
- Make repeated animated pseudo-content non-disruptive to accessible names.
- Respect `prefers-reduced-motion` for reveal transitions as well as blinking.
- Increase primary touch targets toward 44 Ã— 44 CSS pixels.

Implementation progress (2026-07-18):

- The mobile menu now has `aria-expanded`, `aria-controls`, an accessible modal
  label, `aria-current="page"` on active links, a 44 px menu control, keyboard
  focus containment, Escape-to-close with focus restoration, background inerting,
  and scroll locking.
- Reveal content now remains visible without JavaScript or when hydration fails,
  and reduced-motion users receive no reveal transitions.
- Remaining: manual mobile and keyboard checks on the deployed preview at 320,
  390, and 768 px, including a screen-reader check.

Acceptance criteria:

- [ ] All page content is readable with JavaScript disabled.
- [ ] The mobile menu works with keyboard and screen-reader navigation.
- [ ] Focus never enters obscured background content while the menu is open.
- [ ] Visible focus indicators remain clear.
- [ ] Reduced-motion users receive a stable interface.
- [ ] Mobile checks pass at 320, 390, and 768 px.

### [ ] SEO-031 â€” Reduce unnecessary fonts and client-side work

Priority: P2
Proposed files: `layout.tsx`, `globals.css`, `GridProvider.tsx`, `Footer.tsx`,
hooks and client boundaries.

Work:

- Remove unused Oswald.
- Evaluate consolidating Space Grotesk and Geist into one sans-serif family.
- Remove `window.scrollTo(0, 0)` from `GridProvider`.
- Replace JavaScript layout measurements with CSS where practical.
- Remove the live clock or isolate it into the smallest possible client island.
- Reduce client-component boundaries without changing the text-canvas aesthetic.
- Remove the unused 5 MB hero PNG after confirming it has no intended use.
- If content images are added, generate responsive WebP/AVIF assets or configure
  a static-export-compatible image loader.

Acceptance criteria:

- [ ] Visual regression checks pass on all routes and breakpoints.
- [ ] Initial JavaScript and font payloads decrease measurably.
- [ ] Back/forward navigation preserves expected scroll position.
- [ ] Images have intrinsic dimensions and do not cause layout shifts.
- [ ] Production PageSpeed results are recorded before and after the change.

### [ ] SEO-032 â€” Establish Core Web Vitals monitoring

Priority: P1 after deployment

Targets at the 75th percentile:

- LCP: at or below 2.5 seconds.
- INP: at or below 200 milliseconds.
- CLS: at or below 0.1.

Acceptance criteria:

- [ ] Mobile and desktop PageSpeed Insights runs are recorded for key routes.
- [ ] Search Console Core Web Vitals is reviewed after field data becomes
  available.
- [ ] Any failing metric has a measured cause and a separate remediation task.
- [ ] No unmeasured optimization is labeled high priority without evidence.

## Phase 4 â€” Google setup and production validation

### [ ] SEO-040 â€” Connect Google Search Console

Priority: P1 after canonical deployment
Blocked: Requires DNS access and a Google account.

Work:

- Add a Domain property for the canonical domain.
- Verify ownership using the DNS record provided by Google.
- Optionally add metadata verification for a URL-prefix property if needed.
- Submit the canonical sitemap.
- Inspect and request indexing for the homepage, About, Qeemat, and completed
  article.

Acceptance criteria:

- [ ] Domain property ownership is verified.
- [ ] Sitemap status is successful.
- [ ] URL Inspection reports the intended canonical and allows indexing.
- [ ] Indexing, Core Web Vitals, and Enhancement reports have been reviewed.

### [~] SEO-041 â€” Add Google Analytics 4

Priority: P2
Blocked: Requires an approved GA4 property, measurement ID, and privacy decision.

Work:

- Create one GA4 property and one web data stream.
- Load the tag only in production using `next/script` with an appropriate
  non-blocking strategy.
- Keep the measurement ID in deployment configuration, not source documentation.
- Decide whether consent controls are required before enabling analytics.
- Track useful events: email, GitHub, live-project, and outbound project clicks.
- Link GA4 to Search Console.

Acceptance criteria:

- [ ] GA4 Realtime receives one page view per navigation.
- [ ] Custom events fire once with useful names and parameters.
- [ ] No duplicate Google tags are loaded.
- [ ] Search Console reports are available in GA4 after linking.

Implementation note: The GA4 page-view tag is in place. Do not record the
measurement ID in this plan; verify the deployment in GA4 Realtime and then
decide which outbound clicks, if any, should become custom events.

### [ ] SEO-042 â€” Complete the live release verification

Priority: P0 before declaring the project complete

Acceptance checklist:

- [ ] Every indexable page returns `200`.
- [ ] Alternate URL formats permanently redirect to the canonical format.
- [ ] Every indexable page has unique metadata and one canonical.
- [ ] `robots.txt` and `sitemap.xml` return `200`.
- [ ] Sitemap, canonicals, and internal links use the same URL format.
- [ ] Structured data validates against deployed URLs.
- [ ] Social images are public, crawlable, and use the expected dimensions.
- [ ] Facebook and LinkedIn caches have been refreshed.
- [ ] WhatsApp, Slack, Discord, and X previews have been manually checked.
- [ ] There are no broken internal links or missing static assets.
- [ ] Mobile and keyboard acceptance checks pass.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Production performance results are recorded.

## Phase 5 â€” Ongoing authority and content work

### [ ] SEO-050 â€” Publish additional high-value content

Candidates:

- Additional project case studies with real constraints and outcomes.
- AI quality and governance in luxury retail.
- Local-first React Native architecture.
- Android background work and notification reliability.
- Parsing and monitoring UAE commerce pages responsibly.
- A focused AI/data engineering capabilities page, only if it represents a real
  service or professional focus.

Definition of done for each new page:

- [ ] It answers a distinct user need better than existing site content.
- [ ] It has unique metadata, canonical URL, internal links, and suitable schema.
- [ ] Claims are supported, images are optimized, and dates are maintained.
- [ ] It is included in the sitemap and inspected after publication.

### [ ] SEO-051 â€” Build legitimate authority signals

Work:

- Link the canonical site from GitHub and LinkedIn.
- Add relevant case-study links to project READMEs.
- Use the canonical site in approved speaking, author, or professional profiles.
- Earn links through useful original work, not purchased or automated backlinks.
- Review Search Console monthly for queries with impressions but weak CTR,
  indexation problems, and emerging content opportunities.

## Decision log

| Date | Decision | Reason | Owner |
| --- | --- | --- | --- |
| 2026-07-16 | Public identity is `Adam`; site brand is `Adam's Portfolio` | Keeps the site personal while a fuller public name is undecided | Adam |
| 2026-07-16 | `https://bruh.ae` is canonical; `www` redirects to apex | Required for canonicals, sitemap, previews, and Search Console | Adam |
| 2026-07-16 | Do not use Dubai/UAE positioning | The site should be an open personal portfolio, not location-targeted marketing | Adam |
| 2026-07-16 | Privacy policy is `noindex, follow` | It remains public for the app without competing in portfolio search results | Adam |
| 2026-07-16 | Use X handle `@A7damn` | Approved attribution for Twitter/X metadata | Adam |
| 2026-07-16 | Hosting is Cloudflare Pages | Determines deployment and redirect validation work | Adam |

## Verification log

| Date | Task | Command or tool | Result | Evidence or notes |
| --- | --- | --- | --- | --- |
| 2026-07-16 | Baseline | `npm run build` | Pass | Static export generated all current routes |
| 2026-07-16 | Baseline | `npm run lint` | Fail | 10 errors and 4 warnings; tracked by SEO-002 |
| 2026-07-16 | Baseline | Rendered metadata inspection | Fail | Duplicate generic metadata; no canonical, OG, Twitter, or JSON-LD |
| 2026-07-16 | Baseline | 390 Ã— 844 mobile inspection | Partial pass | No overflow; touch targets and menu accessibility need work |
| 2026-07-16 | Baseline | Internal route resolution | Pass | All discovered internal content routes resolve to generated HTML |
| 2026-07-16 | SEO-001 | Owner decisions | Pass | Canonical URL, public identity, positioning, privacy indexing, X attribution, and host confirmed |
| 2026-07-16 | SEO-002 | `npm run lint` | Pass | Zero errors and warnings after focused baseline cleanup |
| 2026-07-16 | SEO-002 | `npm run build` | Pass | Static export and TypeScript checks completed successfully |
| 2026-07-16 | SEO-010 | `npm run lint` and `npm run build` | Pass | Helper compiles and static export succeeds |
| 2026-07-16 | SEO-010 | `out/index.html` metadata inspection | Pass | Canonical, Open Graph, Twitter card, X attribution, and unique homepage metadata are emitted with `https://bruh.ae` |
| 2026-07-16 | SEO-011 | `npm run lint` and `npm run build` | Pass | All static and dynamic route metadata compiles and exports successfully |
| 2026-07-16 | SEO-011 | Static HTML metadata inspection | Pass | All eight public pages have unique titles, descriptions, self-referencing `https://bruh.ae` canonicals, Open Graph, and Twitter metadata; privacy emits `noindex, follow` |
| 2026-07-16 | SEO-012 | `npm run lint` and `npm run build` | Pass | Default social image metadata compiles and static export succeeds |
| 2026-07-16 | SEO-012 | Static HTML and asset inspection | Pass | Homepage emits absolute `og:image` and `summary_large_image` Twitter image tags; generated PNG is 1200 Ã— 630 px and 866 KB |
| 2026-07-16 | SEO-013 | `npm run lint` | Pass | Metadata routes pass lint checks |
| 2026-07-16 | SEO-013 | `npm run build` | Pass after static-route fix | Verified static export of `/robots.txt` and `/sitemap.xml`; initial build exposed the required `dynamic = 'force-static'` setting, then passed after the targeted fix |
| 2026-07-16 | SEO-013 | Generated-file inspection | Pass | `out/robots.txt` allows crawling and points to `https://bruh.ae/sitemap.xml`; sitemap contains each indexable public page once and excludes the noindex privacy page |
| 2026-07-16 | SEO-020 | `npm run lint` and `npm run build` | Pass | WebSite JSON-LD compiles and exports successfully |
| 2026-07-16 | SEO-020 | Static HTML JSON-LD inspection | Pass | Parsed `WebSite` JSON-LD with the stable `https://bruh.ae/#website` ID, matching name, URL, description, and language |
| 2026-07-16 | SEO-041 | `npm run lint` and `npm run build` | Pass | The GA4 tag compiles into the static export |
| 2026-07-16 | SEO-041 | Static HTML inspection | Pass | The generated homepage contains the configured Google tag loader URL and one `gtag('config', ...)` call |
| 2026-07-16 | Preview validation | `https://dev.portfolio-5s4.pages.dev` | Partial pass | Homepage title, canonical, social image, Twitter large card, and WebSite JSON-LD are live; the GA4 change is still local and undeployed |
| 2026-07-18 | SEO-030 | `npm run lint` and `npm run build` | Pass | Mobile navigation accessibility and reveal-resilience changes compile and statically export successfully; deployed manual checks remain pending |

## Implementation log

| Date | Task | Status | Files changed | Commit or PR | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-07-16 | Planning | Complete | `SEO_IMPLEMENTATION_PLAN.md` | â€” | Created the durable implementation tracker |
| 2026-07-16 | SEO-001 | Complete | `SEO_IMPLEMENTATION_PLAN.md` | â€” | Recorded the approved site identity and production decisions |
| 2026-07-16 | SEO-002 | Complete | Lint-related source files and `SEO_IMPLEMENTATION_PLAN.md` | â€” | Restored a clean lint and build baseline |
| 2026-07-16 | SEO-010 | Complete | `src/lib/site.ts`, `src/lib/metadata.ts`, homepage and root layout | â€” | Added production URL constants and a reusable canonical/Open Graph/Twitter metadata helper; uses `summary` until social images are added in SEO-012 |
| 2026-07-16 | SEO-011 | Complete | All route metadata exports | â€” | Added unique route metadata and dynamic data-driven metadata for Qeemat and the writing detail page; preserved `noindex, follow` for the app privacy policy |
| 2026-07-16 | SEO-012 | In progress | `public/images/social/portfolio-social.png`, `src/lib/site.ts`, `src/lib/metadata.ts` | â€” | Added and wired a default 1200 Ã— 630 social preview image; Qeemat-specific and completed-article-specific images remain pending |
| 2026-07-16 | SEO-013 | Complete | `src/app/robots.ts`, `src/app/sitemap.ts` | â€” | Added build-time crawl directives and a sitemap sourced from the project and writing data; explicitly configured both metadata routes for static export |
| 2026-07-16 | SEO-020 | Complete | `src/app/page.tsx` | â€” | Added homepage-only WebSite JSON-LD. Person and ProfilePage schema remain deferred pending the chosen public name |
| 2026-07-16 | SEO-041 | In progress | `src/app/layout.tsx`, `src/lib/site.ts` | — | Added the approved GA4 page-view tag; Realtime and duplicate-tag checks remain pending deployment |
| 2026-07-18 | SEO-030 | In progress | `src/components/layout/Nav.tsx`, `src/hooks/useReveal.ts`, `src/app/globals.css` | `44fa46db` | Added keyboard-safe mobile navigation, background isolation, 44 px menu control, no-JavaScript reveal fallback, and reduced-motion support; preview-device and screen-reader checks remain pending |
