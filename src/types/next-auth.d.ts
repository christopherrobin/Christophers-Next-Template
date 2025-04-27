import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      createdAt: string
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
