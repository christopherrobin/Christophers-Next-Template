import { z } from 'zod'

const envSchema = z.object({
  DATABASE_PUBLIC_URL: z.string().min(1, 'DATABASE_PUBLIC_URL is required'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  // E2E only — set in .env.test
  DATABASE_TEST_URL: z.string().url().optional()
})

function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    console.error('[env] Invalid or missing environment variables:')
    for (const [key, messages] of Object.entries(errors)) {
      if (messages?.length) console.error(`  - ${key}: ${messages.join(', ')}`)
    }
    throw new Error(
      'Invalid environment variables — see .env.local.example for required keys'
    )
  }
  return parsed.data
}

export const env = validateEnv()
export type Env = z.infer<typeof envSchema>
