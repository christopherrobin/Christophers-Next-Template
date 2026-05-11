// `@prisma/adapter-pg` is the node-postgres driver adapter Prisma needs;
// its connection string comes from DATABASE_PUBLIC_URL (env-validated in
// `@/lib/env` at import time).

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_PUBLIC_URL
  })

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error']
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Next dev re-imports modules on every HMR cycle; cache on globalThis
// outside production so we don't spawn a fresh connection per reload.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
