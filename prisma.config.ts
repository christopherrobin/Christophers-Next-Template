import 'dotenv/config'
import path from 'node:path'

import { defineConfig } from 'prisma/config'

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
            'to .env.local and set the connection string before running ' +
            'prisma migrate / generate / studio.'
        )
      }
      return url
    })()
  }
})
