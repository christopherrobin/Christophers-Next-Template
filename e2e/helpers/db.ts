import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_TEST_URL

if (!connectionString) {
  throw new Error(
    '[e2e] DATABASE_TEST_URL is required. Set it in .env.test (see ' +
      '.env.test.example) or your shell. Refusing to fall back to ' +
      'DATABASE_PUBLIC_URL — that would truncate your dev database.'
  )
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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
