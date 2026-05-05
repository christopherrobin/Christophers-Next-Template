# Christophers-Next-Template

[![CI](https://github.com/christopherrobin/Christophers-Next-Template/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/christopherrobin/Christophers-Next-Template/actions/workflows/ci.yml)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4-000000?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)

![Howdy Preview](public/howdy.png)

## A modern, minimal authentication starter for developers, built with Next.js, TypeScript, Prisma, and Tailwind CSS.

**Howdy!** This starter kit is designed for those who want a clean, extensible foundation for building modern, full-stack web applications with authentication using Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Stack

- **Next.js 16** with App Router (Turbopack default)
- **React 19**, **TypeScript 6** (strict)
- **Prisma 6** with PostgreSQL
- **Tailwind CSS 4** for styling
- **NextAuth.js 4** for authentication (email & password, JWT sessions)
- **Zod + react-hook-form** for form validation (shared client/server schemas)
- **Heroicons** for modern SVG icons
- **bcrypt** (via bcryptjs) for secure password hashing

## Tooling & Features

- **ESLint** and **Prettier** for code quality
- **Unit & Component Testing** with Jest & Testing Library
- **End-to-End (E2E) Testing** with Playwright
- User registration and login flows
- Protected dashboard for authenticated users

## Resolutions (yarn `resolutions` block)

<!-- last audited: 2026-05-05 — kept in sync with sibling MUI template -->

The `package.json` `resolutions` block forces patched versions of transitive dependencies that direct dependencies haven't yet pulled. Each pin is justified by a real audit finding; audit periodically and remove pins as direct deps catch up.

| Pin                 | Why                                                                                                                 | Remove when                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `diff >=4.0.4`      | [GHSA-73rr-hh4g-fpgx](https://github.com/advisories/GHSA-73rr-hh4g-fpgx) via `ts-node>diff`                         | ts-node 11+ ships newer diff                        |
| `flatted >=3.4.2`   | [GHSA-rf6f-7fwh-wjgh](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) via ESLint flat config                     | ESLint major bump pulls newer flatted               |
| `js-yaml >=3.14.2`  | [GHSA-mh29-5h37-fv8m](https://github.com/advisories/GHSA-mh29-5h37-fv8m) via `@istanbuljs/load-nyc-config`          | Coverage tooling drops js-yaml@3                    |
| `minimatch >=3.1.3` | [GHSA-7r86-cg39-jmmj](https://github.com/advisories/GHSA-7r86-cg39-jmmj)                                            | Direct deps drop transitives on old minimatch       |
| `picomatch >=4.0.4` | [GHSA-3v7f-55p6-f55p](https://github.com/advisories/GHSA-3v7f-55p6-f55p) via Jest's anymatch                        | Jest 31+ moves to picomatch 4+                      |
| `postcss >=8.5.10`  | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) via Next.js                                | Next 17+ pulls newer postcss                        |
| `preact >=10.26.10` | [GHSA-36hm-qxxp-pg3m](https://github.com/advisories/GHSA-36hm-qxxp-pg3m) via preact-render-to-string                | preact-render-to-string drops old preact constraint |
| `yaml >=1.10.3`     | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) — MUI sibling origin; kept here for parity | Direct deps drop transitives on yaml@1              |

**Intentionally not pinned:** `uuid <14.0.0` ([GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)). uuid 14 is ESM-only and breaks Jest's transform of next-auth's pinned `uuid@8.3.2`. The pin itself has no live advisory. Revisit when next-auth ships uuid 14 support, or when Jest's ESM handling matures.

## Getting Started

Clone and set up the project in minutes:

### Prerequisites

- Node.js 24+ (a `.nvmrc` is provided — run `nvm use`)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/christopherrobin/Christophers-Next-Template
   cd Christophers-Next-Template
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local` and fill in your database and secret values.
4. Run Prisma migrations:
   ```bash
   yarn prisma migrate deploy
   ```
5. Start the development server:
   ```bash
   yarn dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `src/app/` — Next.js App Router pages (home, sign-up, sign-in, dashboard, `not-found.tsx`)
- `src/components/` — Reusable UI components (Button, Input, Spinner, GitHubIcon, Providers)
- `src/lib/` — Prisma client, NextAuth config, env validation (`env.ts`), API helpers (`api-utils.ts`), shared Zod schemas (`schemas.ts`)
- `src/proxy.ts` — Next 16 middleware (route protection and auth redirects)
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets and icons
- `e2e/` — End-to-end tests

Unit/component tests are co-located next to source files (e.g. `Button.tsx` + `Button.test.tsx`).

## Customization

Extend or modify any part to fit your project:

- Add new pages or API routes in `src/app/`
- Create custom UI components in `src/components/`
- Adjust authentication logic in `src/lib/auth.ts`
- Update styles via Tailwind config or CSS

## Scripts

- `yarn dev` — Start development server
- `yarn build` — Build for production
- `yarn start` — Start production server
- `yarn prisma:migrate` — Deploy database migrations
- `yarn lint` / `yarn lint:fix` — Lint code
- `yarn format` / `yarn format:fix` — Format code
- `yarn run nuke` — Remove node_modules, reinstall dependencies, and rebuild
- `yarn run clean` — Lint, format, and prettify all code

## Environment Variables

- `DATABASE_PUBLIC_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Secret for NextAuth.js (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Canonical site URL (e.g. `http://localhost:3000`)

## Authentication & Routing

The included `src/proxy.ts` (Next 16's renamed middleware) enforces:

- `/dashboard/*` requires authentication (unauth users are redirected to `/sign-in?callbackUrl=...`)
- `/sign-in` and `/sign-up` redirect authenticated users to `/dashboard`
- `/` is public for everyone

## Forms & Validation

Sign-in and sign-up forms use **react-hook-form + Zod** via `zodResolver`. Schemas live in `src/lib/schemas.ts` and are used by both the client form and the server-side `safeParse` in `/api/sign-up/route.ts` — one source of truth, type-inferred via `z.infer`. Forms set `noValidate` so RHF owns validation (not native HTML5).

## Using Heroicons

This project uses [Heroicons](https://heroicons.com/) for modern SVG icons in React components.

### How to Use Heroicons

- The `@heroicons/react` package is installed as a dependency.
- Import icons into your components. There are two main styles and sizes.
- Use icons as React components, e.g. `<RocketLaunchIcon className="w-5 h-5" />`.
- The custom `Button` component supports passing icons as `startIcon` or `endIcon` props.

For more icons and usage details, see the [Heroicons documentation](https://heroicons.com/).

## Testing

This project supports two main testing methods:

- **Unit & Component Testing** (Jest + Testing Library):
  - Run all tests: `yarn test`
  - Run a specific test file: `yarn test src/components/Button.test.tsx`
  - Tests are co-located next to the components they cover (e.g. `Button.tsx` + `Button.test.tsx`).
  - Uses [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) and [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event/) for React component interaction and assertions.

- **End-to-End (E2E) Testing** (Playwright):
  - Run all E2E tests: `yarn test:e2e`
  - Specs live in the `e2e/` directory.
  - Uses [Playwright](https://playwright.dev/) for browser-based end-to-end testing.

## License

This project is open source and available under the [MIT License](LICENSE).
