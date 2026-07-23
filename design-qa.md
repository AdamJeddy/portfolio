# Homepage design QA

## References and evidence

- Desktop source visual truth: `C:\Users\Main\.codex\generated_images\019f7579-f734-71a0-b680-bf2207fd7a87\call_GJAY3rrhWFdnnQoEJ16UH8Oq.png`
- Mobile source visual truth: `C:\Users\Main\.codex\generated_images\019f7579-f734-71a0-b680-bf2207fd7a87\call_q47JeMAJsjcRA2UKXlMvrTLs.png`
- Mobile refinement source: `C:\Users\Main\AppData\Local\Temp\codex-clipboard-a60d42de-da59-49d5-a2cf-7107eadb0eb8.png`
- Desktop implementation screenshot: `D:\Code\GitHub\portfolio\.audit\home-desktop-refined-1536.png`
- Mobile implementation screenshot: `D:\Code\GitHub\portfolio\.audit\home-mobile-refined-390.png`

The desktop comparison used a 1536 × 1024 CSS viewport and matching 1536 × 1024 source and implementation pixels at device scale factor 1. The mobile source is a double-density-style 852 × 1846 scroll composition; it was visually normalized against a 390 × 844 CSS viewport and 390 × 843 implementation captures at device scale factor 1.

State: homepage loaded with the dark theme, no menu open, and reveal transitions completed.

## Full-view and focused comparison evidence

The desktop source and implementation were opened together in one comparison input. The user-supplied mobile screenshot and refined implementation were also opened together in one comparison input.

The mobile refinement was judged by first-viewport information density: the complete Qeemat summary, its project link, and the Featured Commentary heading now appear by 752px at 390px wide and by 742px at 320px wide.

## Findings

- Fonts and typography: Geist/Space Grotesk provide the full “Adam Ahsan” hero and readable copy; Oswald provides the condensed project and commentary display type. The desktop headings are slightly reduced, and the mobile hero and Qeemat title are compact enough to improve first-viewport visibility without losing hierarchy.
- Spacing and layout rhythm: the desktop uses the selected dossier rail, hero/meta split, horizontal transition rule, and 60/40 featured split. Mobile correctly recomposes these into a one-column stack. No horizontal overflow was present at 320, 390, 768, or 1536 pixels.
- Colors and visual tokens: the implementation uses the existing black, white, dim, and translucent-rule tokens. There are no added gradients, shadows, rounded cards, or decorative surfaces.
- Image quality and asset fidelity: neither reference contains raster imagery, logos, illustrations, or non-standard icons that require generated assets. No placeholder art or substitute asset was introduced.
- Copy and content: the name, statement, location, focus, status, Qeemat description/year, and both commentary titles match the approved content and remain sourced from the existing project/post data where applicable.
- Interactions and accessibility: all project, commentary, and “View all” destinations are real links. The mobile menu opens as a labelled modal dialog, closes correctly, and retains the existing focus/inert behavior. Semantic order is H1 → H2 → H3, metadata uses a description list, and visible focus/reduced-motion behavior is preserved.
- Runtime: the browser reported no console errors. The production build, TypeScript check, and lint passed.

## Comparison history

1. The first post-build comparison found no actionable P0, P1, or P2 visual differences.
2. User feedback identified a P2 mobile-density issue: the original hero and Qeemat heading left almost no project detail or commentary visible in the first viewport. The name was changed to “Adam Ahsan,” display sizes were reduced, and mobile spacing was compressed. Post-fix captures show the full project summary, project link, and commentary heading before the fold at both 320px and 390px, with no horizontal overflow.

The implementation intentionally retains two small pre-existing portfolio signatures not shown in the mock: the blinking underscore on the active BRUH link and the bottom-corner theme control. Both are classified as P3 product-specific differences and do not alter the approved hierarchy.

## Implementation checklist

- [x] Recreate the selected desktop hero and metadata structure.
- [x] Build the desktop featured project/commentary split.
- [x] Recompose the design as a single-column mobile page.
- [x] Verify mobile navigation and real destinations.
- [x] Check responsive overflow and browser console output.
- [x] Pass lint, type checking, and static production build.

final result: passed
