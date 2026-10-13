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

## Motion revision after user feedback

The user rejected the first transition flow. The revised motion replaces independently spreading sheets, changing z-index, and timer-based text swaps with a shared scroll timeline.

### Changes and evidence

- The fan gathers into the Build composition. The outgoing sheet then turns around a pivot near its left edge while the next sheet moves into focus. Layer order remains `3, 2, 1` throughout.
- Four reading holds preserve the intro and each chapter composition. Chapter links land inside these holds.
- Text fades and moves according to the same scroll position as the sheets. Two readable titles never overlap. There are no independent CSS timers for these transitions.
- Scroll progress uses 85ms time-based damping, including reverse scrolling. Its animation frame loop stops when the target is reached.
- Background sheets remain opaque in settled scenes so their print does not ghost through other sheets. Only outgoing pages fade during a handoff.
- The red chapter rules now fill with actual chapter progress.

New browser evidence is in `docs/design-research/notebook-v2/`: `desktop-intro.png`, `desktop-build.png`, `desktop-handoff.png`, `desktop-explore.png`, `desktop-write.png`, `mobile-intro.png`, `mobile-explore.png`, and `mobile-handoff.png`. Desktop captures are 1440 x 1024 at density 1; mobile captures are 390 x 844 at density 1. The handoff captures are intermediate scroll states, not settled chapters.

`desktop-comparison.png` places the original 1487 x 1058 reference, normalized to 1440 x 1024, beside the revised initial desktop capture. It was opened and inspected together. The initial editorial layout remains within the chosen direction. `desktop-flow.png` places the three browser-rendered reading compositions together, normalized to 720 x 512 each without cropping; it was inspected for consistent alignment, grouped artwork, and visible controls. Individual full-view chapter and mobile captures provide focused transition evidence.

### Verification

- Production build and lint pass. All seven motion tests pass, including reading holds, all timeline boundaries, text exclusivity, reverse movement, and settling at 60Hz/120Hz.
- Browser checks covered chapter navigation, forward scrolling, reverse scrolling, the three reading compositions, and the mobile handoff. No horizontal overflow at 390px; layer order remains fixed.
- Reduced-motion emulation gives one 780px hero and copy opacities `1, 0, 0, 0`. Emulation and viewport overrides were reset after testing.
- Browser console error check: none observed.
- No new runtime dependencies. Review checked animation-frame cancellation, media-query changes, progressive rendering, and native modifier-click behavior.

No actionable P0/P1/P2 technical or layout issues were observed in this revision. The live preview is the appropriate way to evaluate the revised motion's feel; the user's design acceptance remains separate from these checks.

final result: passed
