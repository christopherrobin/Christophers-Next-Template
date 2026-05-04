// NextAuth v4 — update getServerSession + AuthOptions imports on v5 migration
import { NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'

import { authOptions } from '@/lib/auth'

type AuthResult = { error: NextResponse } | { session: Session; userId: string }

/**
 * Standard error response helper for API routes.
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Guard helper for authenticated API routes. Returns the session and
 * userId on success, or an error response to return early.
 *
 * Usage:
 *   const auth = await requireAuth()
 *   if ('error' in auth) return auth.error
 *   const { session, userId } = auth
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)
  if (!session?.user || !('id' in session.user) || !session.user.id) {
    return { error: errorResponse('Unauthorized', 401) }
  }
  return { session, userId: session.user.id as string }
}
