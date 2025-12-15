# ISSGEO

## Short summary

- React + Bun project with server entry (`entry-server.tsx`) supporting SSR/hydration.
- Routing with TanStack Router, i18n using `react-i18next`, and a backend API structure under `src/api` (Hono + Drizzle).

## Quick setup

To setup your dev environment be sure to have these software installed

- Docker
- A linux shell (WSL on windows)
- Bun

Install the dependencies and the database with all migrations

```sh
bun init:all
```

After installation build the front bundle

```sh
bun build:client
```

Run the dev server

```sh
bun dev
```

## Useful commands

- Development: `bun run dev`
- Build client/server: `bun run build`
- Start local DB (Docker): `bun run wake:db`
- Run migrations: `bun run migrate:db`
- Seed DB: `bun run seed:db`

## Internationalization (i18n)

- Translations live in `i18n/locales/*.json` and initialization is in `i18n/index.ts`.
- To add a new string: add the key to both `en.json` and `fr.json` (or the target language), then use `useTranslation()` and `t('path.to.key')` in components.

## SEO & Open Graph

- Example OG generator: `src/seo/og.tsx` (uses `satori` + `sharp`).
- Meta helper: `src/seo/index.ts` (returns a simple map of meta keys to values).
- Example usage (server route):

```ts
import { generateOgImage } from '~/src/seo/og';

const buffer = await generateOgImage({ title: 'Page title' });
// return as PNG response with proper headers
```

## Architecture & structure

- See `ARCHITECTURE.md` for a detailed layout of folders and architecture decisions.

## Contributing

- Follow existing git hooks (`lefthook`) and commit conventions (`commitlint`).
- Format with: `bun run fmt` and lint with: `bun run lint`.

## Next steps I can help with

- Add an API route `GET /api/og?title=...` to serve OG images dynamically.
- Integrate `react-helmet-async` in `entry-server.tsx` for server-side meta rendering.

## To install dependencies

```bash
bun install
```

### To start dev server

```bash
bun dev
```

## To run in production

```bash
bun start
```

This project was bootstrapped with Bun.
