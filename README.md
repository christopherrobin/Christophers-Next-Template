# Christophers-Next-Template

![Howdy Preview](public/howdy.png)

## A modern, minimal authentication starter for developers, built with Next.js, TypeScript, Prisma, and Tailwind CSS.

**Howdy!** This starter kit is designed for those who want a clean, extensible foundation for building modern, full-stack web applications with authentication using Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication (email & password)
- **Heroicons** for modern SVG icons
- **bcrypt** (via bcryptjs) for secure password hashing

## Tooling & Features

- **ESLint** and **Prettier** for code quality
- **Unit & Component Testing** with Jest & Testing Library
- **End-to-End (E2E) Testing** with Playwright
- User registration and login flows
- Protected dashboard for authenticated users

## Getting Started

Clone and set up the project in minutes:

### Prerequisites

- Node.js 22+ (a `.nvmrc` is provided — run `nvm use`)
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

- `src/app/` — Next.js App Router pages (home, join, sign-in, dashboard, `not-found.tsx`)
- `src/components/` — Reusable UI components (Button, Input, Spinner, GitHubIcon, Providers)
- `src/lib/` — Prisma client and NextAuth configuration
- `src/middleware.ts` — Route protection and auth redirects
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

The included `src/middleware.ts` enforces:

- `/dashboard/*` requires authentication (unauth users are redirected to `/sign-in?callbackUrl=...`)
- `/sign-in` and `/join` redirect authenticated users to `/dashboard`
- `/` is public for everyone

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
