# Signal Studio first-version design QA

Date: 2026-10-14. Branch: `codex/signal-studio-v1`. Scope: the selected Signal Studio homepage, project presentation assets, and responsive scroll behavior.

## Source and comparison evidence

Paths are relative to this repository under `docs/design-research/signal-studio-v1/`.

| Surface | Source | Implementation | Comparison |
| --- | --- | --- | --- |
| Initial desktop | `desktop-reference.png` | `desktop-layout.png`, `desktop-final.png` | `desktop-comparison.png` |
| Initial mobile | `mobile-reference.png` | `mobile-final.png` | `mobile-comparison.png` |
| Whole desktop page | `fullpage-reference.png` | `desktop-full.png` | Full page inspected in addition to viewport comparisons |
| Project detail regions | User's supplied Layla screenshot and selected Qeemat concept | `mobile-qeemat.png`, `mobile-layla.png` | Full project viewport captures inspected individually |

Desktop source is 1487 x 1058 pixels, normalized to 1440 x 1024. Browser viewport is 1440 x 1024 at density 1. Desktop comparison is 2880 x 1024, with reference left and implementation right. The static-layout capture uses reduced motion so imagery is fully revealed; `desktop-final.png` records the normal initial scroll state.

Mobile source is 805 x 1954 pixels. It was scaled proportionally to 390px wide, then the top 844px was compared with the browser's 390 x 844 capture at density 1. Mobile comparison is 780 x 844, with reference left and implementation right. These combined comparisons were opened and inspected, not inferred from filenames. Focused project captures also show the actual supplied Layla image and the Qeemat showcase at readable presentation scale.

Full desktop capture is 1440 x 3755 in reduced-motion mode. It includes all sections and the existing live-clock/social footer. The page is taller than the generated extended reference because it displays full project visuals, including the newly supplied portrait Layla screenshot, rather than cropping them to the reference's landscape proportions.

## Findings and fixes

- [P2, resolved] The existing footer's calculated width plus new homepage margins produced horizontal overflow. Homepage-specific footer widths now include the gutters. Post-fix document width equals viewport width at 320, 390, 768, and 1440px.
- [P2, resolved] Initial headline tracking made word separation too tight. Tracking and word spacing were adjusted; the two-line desktop and four-line narrow-mobile headline remain within their gutters. Evidence: earlier `.audit/signal/desktop-initial.png`, final viewport comparisons above.
- [P2, resolved] Header-aware hero motion initially assumed the desktop header height. It now measures the actual header inset, so the mobile initial state does not start partially compressed.

No actionable P0/P1/P2 correctness, layout, or accessibility issues were observed in the tested homepage.

## Design evaluation and responsive choices

- Typography: Inter Tight supplies the oversized bold display and body text; Geist Mono supplies labels and navigation. The display shapes differ slightly from the generated concept, but the hierarchy and two-line desktop composition are maintained. Article titles wrap naturally.
- Spacing and layout: lime introduction, full-width blue Qeemat section, pale Layla section, white writing section, and lime contact section follow the selected desktop structure. Thin rules, underlined links, broad gutters, and open sections avoid nested card layouts.
- Mobile intentionally uses larger readable copy and a single-column project layout instead of the generated source's compressed desktop-style columns. Its hero occupies more of the first viewport, with selected work visible below it. This is a responsive interpretation of the selected visual direction.
- Tokens: lime `#ddf46a`, ink `#080907`, cobalt `#0047ff`, pale `#f3f1fc`, and white. Focus rings use the section's contrasting foreground. White arrow assets are inverted on cobalt.
- Images: Layla uses the supplied screenshot, preserving its content and portrait aspect ratio. It is compressed to a 49,248-byte WebP. Qeemat uses a genuine generated transparent showcase matching the approved concept, 1200 x 1100 and 114,496 bytes. It is labelled as a product concept. Source assets are retained under `source-assets/`. No code-drawn replacement product illustrations were used.
- Content: homepage presentation copy lives in `src/lib/homepage-projects.ts`; existing project titles, detail routes, writing data, metadata, and website JSON-LD remain connected to their existing helpers.

## Motion and interaction verification

- Hero text compresses slightly as it leaves the viewport. Project imagery rises, expands, and opens its crop as the section enters. Native scrolling is preserved; there is no long pinned sequence, wheel interception, or continuous idle animation loop.
- Reduced-motion emulation returns `transform: none` for both project frames. The server-rendered baseline also displays all content without requiring animation to initialize.
- Primary anchor reaches selected work. Qeemat link navigates to `/projects/qeemat` and the existing page renders correctly.
- Mobile menu focuses its first link, traps focus in the existing navigation, closes on Escape, and returns focus to its toggle.
- Browser checks covered 320 x 700, 390 x 844, 768 x 1024, and 1440 x 1024. No horizontal overflow after fixes.
- Existing detail-page palette is isolated from the homepage's scoped rules. Route navigation confirmed the project page body uses its original black background.
- Browser console error check: none observed. Viewport and reduced-motion overrides were reset before handoff.

## Code verification and review

`npm run build`, `npm run lint`, and all three `tests/signal-motion.test.mjs` tests pass. Motion tests cover clamping, reveal timing, and continuous reverse scrolling. Review checked event cleanup, resize/media-query updates, image dimensions, semantic headings and links, content separation, and dependency scope. No runtime dependency was added. Retired notebook motion code and its tests were removed from this branch; the prior implementation remains in branch history.

## Follow-up polish and limits

- [P3] Display-font shapes and some microtype spacing differ from the generated design.
- [P3] Full portrait imagery and the existing footer make this first version longer than the compact generated full-page concept.
- QA used Chromium in the Codex browser; physical-device and Safari verification remain unperformed.
- Qeemat imagery is concept artwork approved for the portfolio presentation, not evidence of the current app UI or live prices.

final result: passed
