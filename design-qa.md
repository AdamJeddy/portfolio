# Notebook portfolio design QA

Date: 2026-10-13. Scope: first implementation of the selected light editorial notebook concept, with scroll-driven paper chapters and the portfolio's existing content.

## Visual evidence

All paths below are relative to this repository. Reference is on the left and implementation is on the right in each comparison.

| View | Source visual truth | Browser implementation | Comparison | CSS viewport |
| --- | --- | --- | --- | --- |
| Desktop | `docs/design-research/notebook-v1/desktop-reference.png` | `docs/design-research/notebook-v1/desktop-implementation.png` | `docs/design-research/notebook-v1/desktop-comparison.png` | 1440 x 1024 |
| Mobile | `docs/design-research/notebook-v1/mobile-reference.png` | `docs/design-research/notebook-v1/mobile-implementation.png` | `docs/design-research/notebook-v1/mobile-comparison.png` | 390 x 844 |

State: initial homepage, scroll position zero, menu closed. Screenshots show the exported production build served locally, without development overlays.

Desktop source is 1487 x 1058 pixels, normalized to 1440 x 1024. Mobile source is 853 x 1844 pixels, normalized to 390 x 844. Implementation captures are at CSS viewport dimensions (density 1). Normalization changes source aspect ratio by less than 0.2%. Comparisons are 2880 x 1024 and 780 x 844 respectively.

Full-view comparisons were opened and inspected together. Separate region crops were unnecessary because both full-view comparisons show the entire first screen, including typography, artwork, navigation, CTA, and chapter rail at readable size.

## Findings and iteration history

- [P2, resolved] Initial mobile title was too small and the artwork began too far below the CTA. Increased Newsreader title size and weight, tightened the copy spacing, and moved the artwork upward. Earlier evidence: `.audit/notebook/mobile-comparison.png`; post-fix evidence: the mobile comparison above.
- [P2, resolved] Initial desktop sheets extended behind the chapter rail. Reduced artwork width relative to viewport height and adjusted its position. Earlier evidence: `.audit/notebook/desktop-comparison.png`; post-fix evidence: the desktop comparison above.
- [P2, resolved] Tablet-size paper artwork could extend below the rail. Capped mobile artwork width at 540px and used a two-line headline at 500-768px. Rechecked at 768 x 1024: controls remain visible and document width equals viewport width.
- [P2, resolved] Resize measurements could depend on the current sticky offset. The scroll start now uses the stage's computed top inset, keeping chapter positions stable during resize.
- [P2, resolved] A long story without JavaScript would leave unnecessary empty scrolling. The long scroll region is now enabled only after motion initialization; the server-rendered baseline is a single hero.

No actionable P0/P1/P2 issues remain in the tested homepage experience.

## Design evaluation

- Typography: Newsreader provides the selected large serif hierarchy, with Geist Mono for labels and Geist Sans for project descriptions. Mobile headline wraps into three lines; wider layouts use two. Display text is legible and does not overflow at 320px. Native font rendering differs slightly from the generated mockup.
- Layout: ivory canvas, fine rules, left-aligned editorial copy, paper artwork, underlined CTA, and bottom chapter navigation follow the selected direction. Mobile and tablet layouts retain readable copy and accessible controls.
- Tokens: warm ivory `#f5f2eb`, ink `#191917`, and red `#d92d19` match the intended palette. Focus and active chapter indicators use the red accent.
- Assets: three genuine generated transparent paper images, compressed to WebP (about 484 KiB combined), retain textured paper, black print, and a red center sheet. Official Lucide arrow assets are used. No code-drawn substitute illustrations were introduced.
- Content: existing Layla AI, Qeemat, article titles, descriptions, route links, and metadata remain content-driven. The three animated sheets correspond to Build, Explore, and Write. This first version uses three independently moving sheets; the concept's extra decorative leaves are a possible later refinement.

## Interaction and implementation verification

- Production build and lint passed; all four motion tests passed.
- Tested at 1440 x 1024, 390 x 844, 768 x 1024, and 320 x 568. No horizontal document overflow at tested mobile widths.
- Chapter links reach Layla AI, Qeemat, and the writing scene; sheet transforms move continuously with scroll progress.
- The Build project's link navigates to `/projects/layla-ai`; its existing detail layout loads with the original dark palette. Homepage styling is scoped to the homepage.
- Mobile menu opens, focuses its first link, closes on Escape, and returns focus to the toggle after its animation frame.
- Reduced-motion emulation produces a 780px static hero rather than the long pinned region. The primary CTA reaches selected work through its native anchor.
- Screens shorter than 600px receive the same static fallback. At 320 x 568 the full headline and primary CTA remain visible and usable.
- Checked browser console errors after navigating and scrolling: none observed. Motion/viewport emulation was reset before handoff.
- Code review covered correctness, readability, content boundaries, security, and performance. No new runtime dependencies or persistent idle animation loop were added.

## Follow-up polish and limits

- [P3] Additional decorative leaves and more refined paper choreography could make the fan closer to the generated concept.
- [P3] Exact serif shapes and small-label spacing vary from the image mockup; the visual hierarchy is preserved.
- Browser verification used Chromium in the Codex browser. Physical-device and Safari testing remain outside this local first-version check.
- Animation uses transforms of curved raster sheets; it does not simulate paper bending in WebGL.

final result: passed
