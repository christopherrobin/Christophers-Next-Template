import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Route gate paired with {@link config.matcher} below.
 *
 * - Anonymous visits to `/dashboard/*` redirect to `/sign-in` with a
 *   `callbackUrl` set to the original path+query.
 * - Authenticated visits to `/sign-in` or `/sign-up` redirect straight
 *   to `/dashboard`.
 * - Everything else on the matcher passes through unchanged.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/dashboard') && !token) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set(
      'callbackUrl',
      request.nextUrl.pathname + request.nextUrl.search
    )
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/dashboard', '/dashboard/:path*']
}
