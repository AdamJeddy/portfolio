# bruh.ae (retro version)

A modern parody of early‑2000s personal/fan‑page aesthetics using static HTML/CSS/JS.

## What’s here
- Static site source in `src/` with simple partial includes (`src/partials/header.html`, `src/partials/footer.html`).
- Pages: `index.html`, `about.html`, `projects/index.html`, `blog/index.html`, `guestbook.html`.
- Theme CSS in `src/styles/theme.css` (single place for tokens).
- Vanilla JS in `src/scripts/main.js` (mobile menu, hit counter, small PE).
- 2000s assets in `src/assets/2000s/` (placeholders provided; replace with your own free-to-use assets).
- Tiny build script `build.js` to expand includes and copy assets.

## Develop / Preview
1. Install Node (>=16).
2. Build the site:
   - `npm run build`
3. Serve the built site (optional quick server):
   - `npm run serve`
   - Open http://localhost:5173

Output goes to `dist/`.

## Development helper

For a simple develop-and-preview workflow on Windows (PowerShell):

- Run the dev helper which builds, serves, opens the site, and watches `src/` for changes:

```powershell
cd D:\Code\GitHub\portfolio
.\dev.ps1
```

- The script will start a preview server on http://localhost:5173 (if the port is free), open the URL, and rebuild automatically when files in `src/` change.

- You can also build manually and serve:

```powershell
npm run build
npm run serve
Start-Process "http://localhost:5173"
```

## Editing
- Update site-wide nav/footer by editing the partials in `src/partials/`.
- Update theme colors/spacing in `src/styles/theme.css`.
- Add new pages under `src/pages/` and include the header/footer with:
  - `<!--#include file="../partials/header.html" -->`
  - `<!--#include file="../partials/footer.html" -->`
- Optional per-page title/description via a JSON meta comment at the top:
  - `<!--{ "title": "Page Title", "description": "Desc" }-->`

## Accessibility & performance
- Focus-visible outlines, good contrast, tap targets for mobile.
- No frameworks on the client. Only small CSS/JS and tiny local hit counter.

## Notes
- Guestbook is static and uses localStorage for demo. Can be wired to a serverless endpoint later.
- Replace placeholder GIFs/PNGs in `src/assets/2000s/` with your curated set to complete the vibe.
