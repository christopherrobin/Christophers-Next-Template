import { PrismaClient, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

const databaseUrl =
  process.env.DATABASE_TEST_URL ?? process.env.DATABASE_PUBLIC_URL

const prisma = new PrismaClient({
  datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined
})

export interface SeedUserInput {
  email: string
  password: string
}

export async function seedUser({
  email,
  password
}: SeedUserInput): Promise<User> {
  const hashed = await hash(password, 12)
  return prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed }
  })
}

export async function clearUsers(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "User" RESTART IDENTITY CASCADE'
  )
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } })
}

export async function disconnect(): Promise<void> {
  await prisma.$disconnect()
}
