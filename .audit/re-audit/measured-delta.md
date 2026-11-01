# Measured before/after — `dev` build vs branch build

Both values are measured by `.audit/re-audit/measure.mjs` against a real `npm run build`: the baseline is the merged `dev` commit `b4fe0833` built in a temporary worktree, the after value is the branch `/out`.

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

## Per-page metadata, structured data and image payload

| Page | Title chars (before → after) | JSON-LD types (before → after) | Referenced image bytes (before → after) |
|---|---|---|---|
| about.html | 47 | 45 |  | Person+WebSite+ProfilePage | - | - |
| contact.html | 12 | 28 |  |  | - | - |
| index.html | 16 | 20 | WebSite | Person+WebSite | 387 KB | 261 KB |
| projects/layla-ai.html | 27 | 21 |  | CreativeWork+Person+WebSite | 9414 KB | 897 KB |
| projects/qeemat.html | 38 | 50 |  | SoftwareApplication+Person+WebSite | 112 KB | 82 KB |
| projects.html | 27 | 42 |  |  | 379 KB | 253 KB |
| track-my-salah-privacy-policy.html | 29 | 42 |  |  | - | - |
| writing/how-a-tech-company-accidentally-becomes-political.html | 68 | 62 | Article | Article+Person+WebSite | - | - |
| writing/quiet-death-saas-pricing-power.html | 56 | 50 | Article | Article+Person+WebSite | - | - |
| writing/ugly-truth-luxury-brands-ai-content.html | 70 | 64 | Article | Article+Person+WebSite | - | - |
| writing.html | 29 | 47 |  |  | - | - |

## Layla page raster payload

- before: 9414 KB across 13 images (the audit measured 9.64 MB / 13 tags)
- after: 897 KB across 14 images
- change: -90.5%
