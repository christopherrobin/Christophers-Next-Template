import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      createdAt?: string
      emailVerified?: string | null
      updatedAt?: string
    } & DefaultSession['user']
  }
  interface User {
    id: string
    createdAt: string
    emailVerified?: string | null
    updatedAt?: string
  }
}

declare module 'next-auth/jwt' {
  // JWT only carries fields the jwt() callback actually writes. The user id
  // lives at JWT.sub (NextAuth's canonical user-id slot, set by the JWT
  // strategy). We don't duplicate it as `id` to avoid type-vs-runtime drift.
  interface JWT {
    emailVerified?: string | null
    updatedAt?: string
    createdAt?: string
  }
}
