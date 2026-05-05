import { execSync } from 'node:child_process'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

async function globalSetup() {
  const databaseUrl = process.env.DATABASE_TEST_URL

  if (!databaseUrl) {
    throw new Error(
      '[playwright] DATABASE_TEST_URL is required for E2E runs. Set it in ' +
        '.env.test (see .env.test.example) or your shell. Refusing to fall ' +
        'back to DATABASE_PUBLIC_URL — that would truncate your dev database.'
    )
  }

  process.env.DATABASE_PUBLIC_URL = databaseUrl

  execSync('yarn prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_PUBLIC_URL: databaseUrl }
  })

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  const prisma = new PrismaClient({ adapter })
  try {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "User" RESTART IDENTITY CASCADE'
    )
  } finally {
    await prisma.$disconnect()
  }
}

export default globalSetup
