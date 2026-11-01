# An open notebook: selected direction and first implementation

The selected direction is the second mobile concept: a warm ivory editorial portfolio with large serif text, red accents, and a fan of printed paper sheets. Desktop and mobile references, implementation captures, and side-by-side comparisons are stored in this folder.

The homepage opens with “A work in progress.” Native scrolling unfolds three independent paper layers and reveals Layla AI, Qeemat, and commentary. A chapter rail provides direct navigation, and a primary link skips directly to selected work. Project and writing links use the existing routes and content helpers.

The implementation uses Next.js, React, a small requestAnimationFrame scroll handler, CSS perspective transforms, Newsreader, and three optimized WebP assets. It adds no runtime package. Reduced-motion settings and short viewports receive a static hero; server-rendered content also remains accessible before animation initializes.

Run `npm run dev` for the editable preview. Verify with `npm run build`, `npm run lint`, and `node --experimental-strip-types --test tests/notebook-motion.test.mjs` on Node 22.6 or newer.

See [`../../../design-qa.md`](../../../design-qa.md) for visual evidence, verification results, and remaining polish notes. Reference-site research is in [`../pear-2026-10-11/README.md`](../pear-2026-10-11/README.md).
