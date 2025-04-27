// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'

import { authOptions } from '@/lib/auth'

// Create the NextAuth.js handler
const handler = NextAuth(authOptions)

// Export the handler functions for Next.js App Router
export { handler as GET, handler as POST }
