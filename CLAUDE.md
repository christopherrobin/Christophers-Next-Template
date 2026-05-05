# Christophers-Next-Template

A public Next.js 16 starter template with TypeScript, Tailwind CSS 4, Prisma + PostgreSQL, NextAuth.js (credentials), and Zod + react-hook-form for forms.

**Sibling repo:** `../Christophers-Next-MUI-Template` is the MUI variant. The two are kept in feature parity except for styling — when making structural changes here (auth, middleware, tooling, tests, scripts, configs, schemas), consider whether the same change applies there.

## Tech Stack

- Next.js 16 (App Router, Turbopack default)
- React 19, TypeScript 6 (strict)
- Tailwind CSS 4 + `@heroicons/react`
- Prisma 6 + PostgreSQL
- NextAuth.js 4 (Credentials provider, bcryptjs)
- Zod 4 + react-hook-form 7 (form validation, shared client/server schemas)
- Jest 30 + React Testing Library
- Playwright 1.59 (E2E, dotenv-loaded `.env.test`)
- ESLint 9 (flat config, `eslint.config.mjs`)
- Yarn 1.x, Node 24 LTS (pinned in `.nvmrc`)

## Project Layout

```
src/
  app/           # App Router pages + API routes (auth, sign-up)
  components/    # Button, Input, Spinner, GitHubIcon, Providers
  lib/
    auth.ts      # NextAuth config
    prisma.ts    # singleton Prisma client
    env.ts       # Zod-validated process.env (fails fast on import)
    schemas.ts   # signInSchema, signUpSchema (used by both client + server)
    api-utils.ts # errorResponse, validationError, requireAuth helpers
  hooks/         # custom React hooks
  utilities/     # helper functions
  types/         # next-auth.d.ts and other ambient types
  proxy.ts       # Next 16 middleware (route protection / auth redirects)
prisma/          # schema.prisma + migrations
e2e/             # Playwright specs + fixtures + helpers
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
- `yarn lint` / `yarn lint:fix` — ESLint flat config, scoped to `src/` and `e2e/`
- `yarn format` / `yarn format:fix`
- `yarn type-check` — `tsc --noEmit`
- `yarn test` / `yarn test:watch` — Jest
- `yarn test:e2e` — Playwright (requires `.env.test` with `DATABASE_TEST_URL`)
- `yarn clean` — lint:fix + format:fix + `prettier --write .`
- `yarn prisma:migrate` — `prisma migrate deploy`
- `yarn nuke` — wipe `node_modules` and rebuild

## Code Style

- **Prettier:** no semicolons, single quotes, 80-char width, 2-space tabs, no trailing commas. Enforced via lint.
- **ESLint:** strict — `no-unused-vars`, `no-explicit-any`, `ban-ts-comment` are errors. Imports must be alphabetized via `eslint-plugin-import-x`.
- React 19 / hooks only. No class components.

## Conventions

- **Tests are co-located:** `Foo.tsx` lives next to `Foo.test.tsx`. There is no `__tests__/` directory.
- API route handlers in `src/app/api/.../route.ts` follow App Router conventions. Use `errorResponse`/`validationError` from `src/lib/api-utils.ts` for consistent JSON shapes.
- Server components by default; only mark `'use client'` when needed (state, effects, browser APIs).
- Custom button/input components (`src/components/Button.tsx`, `Input.tsx`) wrap native elements with Tailwind classes. Use these instead of raw `<button>`/`<input>` for consistency.

## Forms

Sign-in and sign-up use **react-hook-form + `zodResolver`**. Schemas live in `src/lib/schemas.ts` and are used by both the client form and the server-side `joinSchema.safeParse()` in `/api/sign-up/route.ts` — single source of truth for validation. Forms set `noValidate` on the `<form>` so RHF + Zod owns validation (not native HTML5).

## Auth & Middleware

- NextAuth Credentials provider; passwords hashed with bcryptjs; JWT sessions.
- `src/proxy.ts` (Next 16's renamed middleware) behavior:
  - `/dashboard/*` → requires auth (redirects unauth users to `/sign-in?callbackUrl=...`)
  - `/sign-in` and `/sign-up` → redirect authed users to `/dashboard`
  - `/` → public for everyone (no redirect even if authed)

## Env

`src/lib/env.ts` validates `process.env` on import via Zod and fails fast with a field-by-field error if anything is missing.

Copy `.env.local.example` → `.env.local`:

- `DATABASE_PUBLIC_URL` — PostgreSQL connection string (read by Prisma)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32` (min 32 chars)
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`

For E2E: copy `.env.test.example` → `.env.test` and set `DATABASE_TEST_URL` to a **separate** database. The Playwright `globalSetup` truncates the `User` table before the suite runs, so it must NOT point at your dev or prod DB. The setup throws if `DATABASE_TEST_URL` is unset.

## Fonts

Geist Sans + Geist Mono are loaded via `next/font/google` in `src/app/layout.tsx` and applied to `<body>`. The CSS vars (`--font-geist-sans`, `--font-geist-mono`) are wired in `globals.css` as the default `font-family`.

## What NOT to do

- Don't reintroduce a `__tests__/` directory — co-locate.
- Don't use HTML5 `required` / `type="email"` for validation — schemas are in `src/lib/schemas.ts`. Add a Zod rule there and let RHF render errors.
- Don't add Co-Authored-By lines to commits.
- Don't drift from the MUI sibling repo on auth/middleware/scripts/configs without intentional reason.
- Don't commit `.env*` files (only `.env.local.example` and `.env.test.example` are allow-listed).

## Local-only notes

If you want to keep personal context (preferred agents, todos, scratchpad) outside the committed repo, create `CLAUDE.local.md` — it's gitignored.
