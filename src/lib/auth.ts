// src/lib/auth.ts
import { compare } from 'bcryptjs'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from '@/lib/prisma'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user) throw new Error('Invalid email or password')
        // Compare hashed password
        const valid = await compare(credentials.password, user.password)
        if (!valid) throw new Error('Invalid email or password')

        // Return user with necessary fields, converting Date objects to ISO strings
        return {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          emailVerified: user.emailVerified
            ? user.emailVerified.toISOString()
            : null,
          updatedAt: user.updatedAt.toISOString()
        }
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/sign-in'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // `authorize()` always returns these as ISO strings; NextAuth's
        // base `User` interface widens `emailVerified` to `Date | null`
        // via declaration merging, so narrow it back here.
        token.emailVerified = user.emailVerified as string | null | undefined
        token.updatedAt = user.updatedAt
        token.createdAt = user.createdAt
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        if (!token.sub) throw new Error('No user found')
        session.user.id = token.sub
        session.user.emailVerified = token.emailVerified
        session.user.updatedAt = token.updatedAt
        session.user.createdAt = token.createdAt
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
