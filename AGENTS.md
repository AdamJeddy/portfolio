# AGENTS.md

## Project overview
This repository is a personal portfolio site built with Next.js App Router, React, TypeScript, and Tailwind CSS. The site is content-driven and uses route-level page components plus data helpers in src/lib.

## Core commands
- Install dependencies: npm install
- Start local dev server: npm run dev
- Build for production: npm run build
- Run lint checks: npm run lint

## Important project structure
- src/app: route pages and layout
  - src/app/page.tsx: homepage
  - src/app/projects/page.tsx and src/app/projects/[slug]/page.tsx: project index/detail
  - src/app/content/page.tsx and src/app/content/[slug]/page.tsx: writing index/detail
  - src/app/the-person/page.tsx: about page
- src/components: reusable UI pieces
- src/lib: content and project data helpers
- public/images: static assets

## Working conventions
- Prefer small, focused changes that preserve the existing visual style.
- Keep content and presentation separate where possible; update data helpers or content files rather than hardcoding new content throughout the UI.
- Use TypeScript and keep components simple and readable.
- When changing routes or page structure, ensure navigation and metadata remain consistent.

## Verification expectations
After meaningful changes, verify with:
- npm run build
- npm run lint if the change touches UI or component logic

## Notes for future agents
- This project is intentionally lightweight and content-focused.
- Preserve the portfolio’s distinctive text-canvas aesthetic unless a design change is explicitly requested.
- Avoid introducing unnecessary dependencies or large architectural rewrites without discussing them first.
