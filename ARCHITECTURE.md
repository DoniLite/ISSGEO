# ISSGEO Architecture

This document describes the repository architecture and the role of the main folders and files.

## Root

- `package.json`, `bunfig.toml`, `build.ts`: build scripts and Bun configuration.
- `Dockerfile`, `compose.yaml`: container definitions for database and local/dev environments.

## `src/` folder

- `index.ts` / `client.tsx` / `entry-server.tsx`: application entry points (server + client). The project uses SSR with client hydration.
- `router.ts` / `routeTree.gen.ts`: routing (TanStack Router code generation).
- `api/`: server-side controllers and route handlers organized by domain (user, contact, formations, checkout, etc.). Hono is used for routing.
- `components/`: UI components grouped by feature (about, courses, home, shared, ui). Example: `components/shared/Footer.tsx`.
- `core/`: shared abstractions (base controller, repository, database setup, DTOs) used across the app.
- `db/` and `drizzle/`: SQL schema and migration files (Drizzle ORM). `seeders/` contains development seed scripts.
- `stores/`: client-side state (Zustand stores).
- `i18n/`: internationalization setup (`i18n/index.ts`) and translation files in `i18n/locales/`.
- `src/seo/`: SEO helpers and Open Graph image generation utilities (added).

## Design and patterns

- Monorepo style: front and back live in the same repository. Business logic lives under `api/` (controllers/services/repositories); the UI consumes endpoints using fetch.
- Layered approach: `Repository` -> `Service` -> `Controller` to keep business logic testable and consistent.
- Centralized i18n: translations are managed in `i18n/locales/*.json` and consumed with `react-i18next` (`t()` function).

## SEO & Open Graph

- `src/seo/og.tsx`: example dynamic Open Graph image generator using `satori` + `sharp` — intended as a starting point for dynamic OG images.
- `src/seo/index.ts`: helper that builds common meta tags (og, twitter) for pages.

## Quality and automation

- Biome is used for formatting and linting (`fmt`, `lint`).
- `lefthook` and `commitlint` enforce hooks and commit conventions.

## Recommendations / Next steps

- Consolidate i18n keys per feature (e.g., `pages.home`, `components.footer`) and avoid mixing translations between unrelated namespaces.
- Expose an API endpoint `GET /api/og?title=...` that uses `generateOgImage` and returns a PNG with caching headers for CDNs.
- Optionally, generate static OG images for main pages during the build step for improved performance.
