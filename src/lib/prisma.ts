// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Add prisma binary logging in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error']
  })
}

// Use type for global to avoid TypeScript errors
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Create or use existing Prisma instance
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// Only store singleton in development to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
