import { z } from 'zod'

const envSchema = z
  .object({
    DATABASE_PUBLIC_URL: z.string().min(1, 'DATABASE_PUBLIC_URL is required'),
    NEXTAUTH_SECRET: z
      .string()
      .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
    // Optional in dev (NextAuth infers from request headers); REQUIRED in
    // production for cookie-domain and callback-URL validation. Enforced
    // by the superRefine below.
    NEXTAUTH_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    // E2E only — set in .env.test
    DATABASE_TEST_URL: z.string().url().optional()
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && !env.NEXTAUTH_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_URL'],
        message: 'NEXTAUTH_URL is required in production'
      })
    }
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
