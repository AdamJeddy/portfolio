# About page design QA

## References and evidence

- Selected desktop source: `C:\Users\Main\.codex\generated_images\019f7579-f734-71a0-b680-bf2207fd7a87\exec-23a6f842-9e80-479c-9c07-bd8216f4fbfe.png`
- Mobile companion source: `C:\Users\Main\.codex\generated_images\019f7579-f734-71a0-b680-bf2207fd7a87\exec-553d2b7c-e3d6-40b2-beb6-0c9da24cb3db.png`
- Desktop implementation viewport: `C:\Users\Main\.codex\visualizations\2026\07\18\019f7579-f734-71a0-b680-bf2207fd7a87\about-desktop-final.png`
- Mobile implementation viewport: `C:\Users\Main\.codex\visualizations\2026\07\18\019f7579-f734-71a0-b680-bf2207fd7a87\about-mobile-final.png`
- Same-input desktop comparison: `C:\Users\Main\.codex\visualizations\2026\07\18\019f7579-f734-71a0-b680-bf2207fd7a87\about-qa-desktop-comparison.png`
- Same-input mobile/full-page comparison: `C:\Users\Main\.codex\visualizations\2026\07\18\019f7579-f734-71a0-b680-bf2207fd7a87\about-qa-mobile-comparison.png`

The exact desktop comparison used a 1536 × 1024 viewport. Responsive checks also ran at 320 × 700, 390 × 844, 768 × 900, and 1024 × 900.

## Full-view evidence

The in-app browser's automatic full-page capture duplicated the sticky navigation while stitching. Full coverage was therefore verified with overlapping viewport captures instead:

- Desktop: `about-desktop-final.png` and `about-desktop-bottom.png`
- Mobile: `about-mobile-seg-1.png` through `about-mobile-seg-4.png`

The mobile segments are shown together in the same-input mobile comparison listed above.

## Review

- Typography: Geist carries the editorial heading/body hierarchy and Oswald provides the condensed influence display treatment. The desktop and mobile hero both resolve to the intended two-line headline.
- Spacing and layout: the dossier rail, hero copy, metadata, influence rows, and rules align to the selected composition. No horizontal overflow was present at any tested viewport.
- Colors and tokens: the implementation uses the existing black/white/dim theme variables and translucent rule tokens, including light-theme compatibility.
- Image quality and assets: the target contains no imagery or icons requiring implementation; no substitute CSS art, SVG, or placeholder imagery was introduced.
- Copy and content: approved About copy remains intact. The longer approach and elsewhere sections continue below the shorter reference crop rather than removing approved content.
- States and interactions: the mobile menu opens as a labelled dialog, makes background content inert, locks scrolling, receives focus, closes with Escape, restores focus, and preserves its 44px target.
- Accessibility: semantic heading order is H1 → H2 → H3, metadata uses a description list, decorative dossier rails are hidden from assistive technology, visible focus behavior is inherited, and reduced-motion behavior is preserved.
- Runtime: no browser warnings or errors were reported.

## Iteration history

1. P1 layout: the later shared `.content-layer` rule overrode the intended About width and caused the Innovation title to collide with its description. Fixed with the more specific `.content-layer.about-page` selector and rechecked by bounding-box comparison.
2. P2 typography: the hero wrapped differently from the selected visual and the mobile title used three lines. Tightened the desktop measure and adjusted the mobile type scale; both now use the intended two-line rhythm.
3. P2 spacing: aligned the influence title start, hero divider, and desktop row rhythm more closely to the source while retaining the approved additional sections.
4. P2 accessibility: added a programmatic Elsewhere heading and promoted the final callout to an H3 so the extended page keeps a coherent heading outline.

No P0, P1, or P2 findings remain open.

final result: passed
