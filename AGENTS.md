# AGENTS.md

## Project overview
This repository is a personal portfolio site built with Next.js App Router, React, TypeScript, and Tailwind CSS. The site is content-driven and uses route-level page components plus data helpers in src/lib.

## Core commands
- Install dependencies: npm install
- Start local dev server: npm run dev
- Build for production: npm run build
- Run lint checks: npm run lint
- Run regression tests: npm test

## Important project structure
- src/app: route pages and layout
  - src/app/page.tsx: homepage
  - src/app/projects/page.tsx and src/app/projects/[slug]/page.tsx: project index/detail
  - src/app/writing/page.tsx and src/app/writing/[slug]/page.tsx: writing index/detail
  - src/app/about/page.tsx: about page
- src/components: reusable UI pieces
- src/lib: content and project data helpers
- public/images: static assets

## Working conventions
- Prefer small, focused changes that preserve the existing visual style.
- Keep content and presentation separate where possible; update data helpers or content files rather than hardcoding new content throughout the UI.
- Use TypeScript and keep components simple and readable.
- When changing routes or page structure, ensure navigation and metadata remain consistent.

## Git and pull requests
- Start each feature or fix from an up-to-date `dev` on a dedicated branch named `feature/<short-description>`. Never use `codex` in branch names.
- Open feature and fix pull requests against `dev`; do not commit directly to `dev` or `main`.
- Keep unrelated changes separate, preserve existing uncommitted work, and review the diff before committing.
- Use focused commits with descriptive messages. Do not merge, deploy, or force-push unless the user explicitly requests it.
- Follow a different branch or target only when the user explicitly requests it.

## Verification expectations
After meaningful changes, verify with:
- npm run build
- npm run lint if the change touches UI or component logic
- npm test when behavior or tests change
- For documentation-only edits, inspect the diff and verify referenced paths and commands.

## Notes for future agents
- This project is intentionally lightweight and content-focused.
- Preserve the portfolio’s distinctive text-canvas aesthetic unless a design change is explicitly requested.
- Avoid introducing unnecessary dependencies or large architectural rewrites without discussing them first.
