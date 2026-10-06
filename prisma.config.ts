import path from 'node:path'

import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .env.local first, then .env, matching Next.js precedence so the
// Prisma CLI sees the same DATABASE_PUBLIC_URL as the app. Earlier files
// win; variables already set in the environment (CI) are never overridden.
config({ path: ['.env.local', '.env'], quiet: true })

// Prisma 7 requires datasource URLs to live in this config (not in
// schema.prisma) when using the driver-adapter pattern. The adapter
// itself is wired into the PrismaClient constructor in src/lib/prisma.ts.
//
// Migrate-engine commands (`prisma migrate deploy`, `prisma generate`)
// read this file to find the connection URL.

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations')
  },
  datasource: {
    url: (() => {
      const url = process.env.DATABASE_PUBLIC_URL
      if (!url) {
        throw new Error(
          '[prisma] DATABASE_PUBLIC_URL is required. Copy .env.local.example ' +
            'to .env.local (or set it in .env) before running ' +
            'prisma migrate / generate / studio.'
        )
      }
      return url
    })()
  }
})
