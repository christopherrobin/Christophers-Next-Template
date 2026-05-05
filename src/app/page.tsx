import {
  ArrowRightCircleIcon,
  RocketLaunchIcon,
  SparklesIcon
} from '@heroicons/react/20/solid'
import {
  BeakerIcon,
  BoltIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  CommandLineIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline'
import React from 'react'

import { Button } from '@/components/Button'
import { GitHubIcon } from '@/components/GitHubIcon'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Auth out of the box',
    body: 'NextAuth Credentials + bcrypt with route-protecting middleware.'
  },
  {
    icon: CheckBadgeIcon,
    title: 'Type-safe end to end',
    body: 'Zod schemas shared between client forms and API routes.'
  },
  {
    icon: BeakerIcon,
    title: 'Tests included',
    body: 'Jest + RTL co-located, Playwright E2E against a staging DB.'
  },
  {
    icon: BoltIcon,
    title: 'CI gates every PR',
    body: 'Lint, type-check, unit, and E2E run before anything merges.'
  },
  {
    icon: CommandLineIcon,
    title: 'Pre-commit hooks',
    body: 'simple-git-hooks + lint-staged keep junk out of the history.'
  },
  {
    icon: CubeTransparentIcon,
    title: 'Zero-config starter',
    body: 'Clone, set three env vars, and you are shipping.'
  }
]

const stack = [
  {
    name: 'Next.js',
    version: '16',
    badge:
      'https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
    url: 'https://nextjs.org/',
    blurb: 'App Router, Turbopack, server actions, RSC streaming.'
  },
  {
    name: 'React',
    version: '19',
    badge:
      'https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black',
    url: 'https://react.dev/',
    blurb: 'Server Components, hooks-only, no class components.'
  },
  {
    name: 'TypeScript',
    version: 'strict',
    badge:
      'https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
    url: 'https://www.typescriptlang.org/',
    blurb: 'Strict mode, end-to-end inference, ES2022 target.'
  },
  {
    name: 'Tailwind CSS',
    version: '4',
    badge:
      'https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white',
    url: 'https://tailwindcss.com/',
    blurb: '@theme {} config in CSS, zero JS config file.'
  },
  {
    name: 'Prisma + Postgres',
    version: '7',
    badge:
      'https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white',
    url: 'https://www.prisma.io/',
    blurb: 'Type-safe ORM, driver-adapter, schema migrations.'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 sm:py-16 fadeIn">
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-20">
        {/* Hero */}
        <section className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <SparklesIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>v1 - Next.js 16 starter</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight">
            <span className="text-blue-500">Howdy.</span>
            <span className="block text-white mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Christophers-Next-Template
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl">
            An opinionated Next.js 16 starter with auth, Prisma, end-to-end type
            safety, and a full test pyramid. Fork it, set three env vars, and
            ship.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <GitHubIcon className="w-5 h-5 text-white" />
            <a
              href="https://github.com/christopherrobin/Christophers-Next-Template"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              github.com/christopherrobin/Christophers-Next-Template
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <Button
              href="/sign-up"
              endIcon={<RocketLaunchIcon className="w-5 h-5" />}
              className="sm:min-w-44"
            >
              Sign Up
            </Button>
            <Button
              href="/sign-in"
              endIcon={
                <ArrowRightCircleIcon className="w-5 h-5 text-blue-500" />
              }
              ghost
              className="sm:min-w-44"
            >
              Sign In
            </Button>
          </div>
        </section>

        {/* The Stack — the actual flex */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl tracking-tight">
              Built on the <span className="text-blue-500">latest</span>.
            </h2>
            <p className="text-white/60 max-w-2xl">
              Every dependency is on its current major. Audited weekly,
              security-pinned, type-safe end to end.
            </p>
          </div>

          {/* Big branded badge wall */}
          <div className="flex flex-wrap gap-3 items-center">
            {stack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.badge}
                  alt={`${tech.name} ${tech.version}`}
                  className="h-8"
                />
              </a>
            ))}
          </div>

          {/* Per-tech breakdown grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {stack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-blue-500/40 hover:bg-white/[0.05] transition"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="text-white font-semibold">{tech.name}</span>
                  {tech.version && (
                    <span className="font-mono text-xs text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {tech.version}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {tech.blurb}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl">What is in the box</h2>
            <p className="text-sm text-white/60">
              Everything wired up so you can focus on product, not plumbing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-blue-500/40 hover:bg-white/[0.05] transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 group-hover:bg-blue-500/20 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">{title}</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <GitHubIcon className="w-4 h-4" />
            <a
              href="https://github.com/christopherrobin/Christophers-Next-Template"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              View on GitHub
            </a>
            <span className="text-white/30">-</span>
            <span>MIT License</span>
          </div>
          <div>
            Built by{' '}
            <a
              href="https://github.com/christopherrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              @christopherrobin
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
