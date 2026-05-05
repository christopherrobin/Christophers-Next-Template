# Christophers-Next-Template

A public Next.js 15 starter template with TypeScript, Tailwind CSS 4, Prisma + PostgreSQL, and NextAuth.js (credentials).

**Sibling repo:** `../Christophers-Next-MUI-Template` is the MUI variant. The two are kept in feature parity except for styling — when making structural changes here (auth, middleware, tooling, tests, scripts, configs), consider whether the same change applies there.

## Tech Stack

- Next.js 15.3 (App Router, Turbopack dev)
- React 19, TypeScript 5.8 (strict)
- Tailwind CSS 4 + `@heroicons/react`
- Prisma 6 + PostgreSQL
- NextAuth.js 4 (Credentials provider, bcryptjs)
- Jest + React Testing Library
- Playwright (E2E)
- Yarn 1.x, Node 22 LTS (pinned in `.nvmrc`)

## Project Layout

```
src/
  app/           # App Router pages + API routes (auth, sign-up)
  components/    # Button, Input, Spinner, GitHubIcon, Providers
  lib/           # auth.ts (NextAuth config), prisma.ts (singleton client)
  hooks/         # custom React hooks
  utilities/     # helper functions
  types/         # next-auth.d.ts and other ambient types
  middleware.ts  # route protection / auth redirects
prisma/          # schema.prisma + migrations
e2e/             # Playwright specs
```

## Path Aliases (tsconfig + jest)

- `@/*` → `src/*`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utilities/*`

## Commands

- `yarn dev` — Next dev (Turbopack); runs `prisma generate` first
- `yarn build` — production build; runs `prisma generate` first
- `yarn start` — production server
- `yarn lint` / `yarn lint:fix`
- `yarn format` / `yarn format:fix`
- `yarn type-check` — `tsc --noEmit`
- `yarn test` / `yarn test:watch`
- `yarn test:e2e` — Playwright
- `yarn clean` — lint:fix + format:fix + `prettier --write .`
- `yarn prisma:migrate` — `prisma migrate deploy`
- `yarn nuke` — wipe `node_modules` and rebuild

## Code Style

- **Prettier:** no semicolons, single quotes, 80-char width, 2-space tabs, no trailing commas. Don't fight this — it's enforced via lint.
- **ESLint:** strict — `no-unused-vars`, `no-explicit-any`, `ban-ts-comment` are errors. Imports must be alphabetized.
- React 19 / hooks only. No class components.

## Conventions

- **Tests are co-located:** `Foo.tsx` lives next to `Foo.test.tsx`. There is no `__tests__/` directory.
- API route handlers in `src/app/api/.../route.ts` follow App Router conventions.
- Server components by default; only mark `'use client'` when needed (state, effects, browser APIs, MUI in the sibling repo).
- Custom button/input components (`src/components/Button.tsx`, `Input.tsx`) wrap native elements with Tailwind classes. Use these instead of raw `<button>`/`<input>` for consistency.

## Auth & Middleware

- NextAuth Credentials provider; passwords hashed with bcryptjs; JWT sessions.
- `src/middleware.ts` behavior:
  - `/dashboard/*` → requires auth (redirects unauth users to `/sign-in?callbackUrl=...`)
  - `/sign-in` and `/sign-up` → redirect authed users to `/dashboard`
  - `/` → public for everyone (no redirect even if authed)

## Env

Copy `.env.local.example` → `.env.local`:

- `DATABASE_PUBLIC_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`

## Fonts

Geist Sans + Geist Mono are loaded via `next/font/google` in `src/app/layout.tsx` and applied to `<body>`. The CSS vars (`--font-geist-sans`, `--font-geist-mono`) are wired in `globals.css` as the default `font-family`.

## What NOT to do

- Don't reintroduce a `__tests__/` directory — co-locate.
- Don't add Co-Authored-By lines to commits.
- Don't drift from the MUI sibling repo on auth/middleware/scripts/configs without intentional reason.
- Don't commit `.env*` files (only `.env.local.example` is allow-listed).
