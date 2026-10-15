# Signal Studio follow-up — 14–15 October 2026

## Changes and route impact

| Route | Result |
| --- | --- |
| `/` | Gentler eased image entrances, measured from each image rather than the whole project section. Maximum movement is 24px on desktop and 12px on mobile. Removed image clipping and reduced hero movement. Native scrolling remains. |
| `/projects` | Signal Studio project index with large type, cobalt Qeemat and ivory/green Layla sections, responsive artwork, and direct case-study links. |
| `/projects/layla-ai` | FACES branding and the approved perfume scene, with challenge, contribution, approach, outcome, section navigation, store links, and next-project navigation. Role: technical integration lead. |
| `/projects/qeemat` | Matching case-study structure and approved concept artwork. Role: creator and owner, responsible for the product and implementation end to end. |
| `/writing` and both `/writing/[slug]` pages | Existing dark text-canvas presentation and content retained. |
| `/about`, `/contact`, `/track-my-salah-privacy-policy` | Existing presentation and content retained. |
| Shared layout | Grid recalculates on resize as well as orientation changes. Removed the mount-time scroll reset that overrode section URL hashes. Navigation URLs and metadata remain consistent. |

Project styles are scoped to `.project-studio` and its presence in the document. Case-study copy is separated in `src/lib/project-studies.ts`. No runtime dependencies were added. New project components render on the server and reuse the compressed, dimensioned WebP assets.

## Commits

- `ecc1b306`: ease homepage reveals from each image position.
- `4f1fe294`: preserve section links and resize touch layouts.
- `e8edef9b`: describe Layla integration and Qeemat ownership.
- `446eb44a`: extend Signal Studio to the project index.
- `9bae383f`: add Signal Studio project case studies.

The earlier 12 design commits were separately split into 35 commits with their recorded author and committer timestamps preserved. See `../history-reorganization-2026-10-14.md`. Exact earlier file-edit times were unavailable and were not fabricated. The original history is preserved on `codex/signal-studio-history-original-20261014`; nothing was pushed.

## Verification

- Production build and ESLint pass, including static generation of the project detail routes.
- All four `tests/signal-motion.test.mjs` tests pass. Node reports its existing module-type warning when importing the TypeScript helper; test results are unaffected.
- Browser checks on the exported build found no horizontal overflow on the homepage, project index, and both project details at 320, 390, 768, 1024, and 1440px. `responsive-checks.json` records the observed widths and image sources.
- Writing index, both writing articles, About, Contact, and privacy render their expected headings and dark background at 390 and 1440px, without horizontal overflow. See `route-checks.json`. Client-side navigation from Projects to Commentary also restores the dark presentation despite project CSS remaining loaded.
- Mobile menu opens with focus on Projects; Tab advances to Commentary; Escape closes the menu and returns focus to the toggle.
- Layla's My role link reaches the contribution section below the sticky header. Homepage selected-work navigation lands at the header's bottom (72px on desktop).
- Grid values update without reloading: 49 columns at 390px and 192 at 1440px.
- With reduced motion emulated, homepage image transforms and clipping are both `none`. The override and temporary viewport sizes were reset after testing.
- No local-page console errors observed. The browser automation tool emitted unrelated telemetry network failures; these were not application console errors.
- Review checked static route generation, metadata, external-link attributes, image sizing/loading, scoped CSS, effect cleanup, semantic heading/anchor structure, and separation of copy from layout.

## Visual evidence

Desktop captures are 1440 × 1024; mobile captures are 390 × 844, at density 1. Normal scrolling is enabled. The accepted Signal Studio homepage and approved product assets supply the visual direction; project-page information hierarchy is intentionally new rather than a pixel clone of the homepage.

- `projects-desktop.png`, `projects-mobile.png`: project index.
- `layla-desktop.png`, `layla-mobile.png`: Layla case hero.
- `layla-contribution.png`, `layla-mobile-contribution.png`: case-study reading layout and anchor position.
- `qeemat-desktop.png`, `qeemat-mobile.png`: Qeemat case hero.
- `mobile-scroll-flow.png`: homepage image entrance.
- `layla-before.png`, `qeemat-before.png`: earlier dark project-page views for historical context.

Opened and inspected the new project index, both desktop heroes, and mobile Layla hero/contribution captures. Type, palette, and approved artwork follow the accepted Signal Studio direction. The mobile layout deliberately places the artwork after the summary, role, and actions, so the complete hero spans more than one viewport. No actionable P0/P1/P2 visual finding remained.

Physical-device and Safari checks remain unperformed. No Lighthouse or real-device performance score is claimed. Raster phone text is illustrative and less sharp than live text. Qeemat imagery remains explicitly labelled as a product concept; case-study copy contains no invented impact metrics.
