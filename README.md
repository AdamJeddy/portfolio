# Adam Portfolio – Static Text Canvas

Pure HTML/CSS/JS. No build tooling required. Deploys directly on Cloudflare Pages.

## Overview
Generates full-viewport monospace lines. Text extends horizontally beyond the viewport edges. The phrase `by Adam` is centered (bold + italic + red) while surrounding text is dark and subdued.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Single page with inline script generating text lines |
| `package.json` | Optional preview + no-op build script (can be removed) |

## Run Locally
Open `index.html` in a browser, or:
```bash
npm run preview
```

## Cloudflare Pages Deployment
Settings:
- Build command: (leave empty) OR `npm run build`
- Output directory: `.`
- No dependencies => skip install step.

## Customize
Inside `index.html` script:
- Change `WORDS` array to alter vocabulary.
- Adjust horizontal overflow by changing `extendedChars` multiplier (currently 1.5× viewport width).
- Edit `HIGHLIGHT` constant to alter highlighted phrase.

## Minimal Footprint
All former framework (Next.js, Tailwind, TypeScript) files have been removed for a lean static setup.

## License
Personal use.