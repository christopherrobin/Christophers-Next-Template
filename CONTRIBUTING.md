# Contributing to Christophers-Next-Template

Christophers-Next-Template is a personal Next.js starter template. Bug reports and small fixes are welcome. For anything larger, please open an issue first so we can agree on the approach before you spend time on it.

## Setup

```bash
nvm use
yarn install --frozen-lockfile
cp .env.local.example .env.local   # then fill in the values
yarn prisma migrate deploy
```

## Before opening a pull request

Run the same checks CI runs:

```bash
yarn type-check && yarn lint && yarn test && yarn build
```

If you change UI or routing, also run `yarn test:e2e` (copy `.env.test.example` to `.env.test` first).

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`).
- Keep pull requests focused on one change. They are squash-merged.
- Add or update tests for any behavior change.

## Security

Please don't report vulnerabilities in public issues. See [SECURITY.md](SECURITY.md).
