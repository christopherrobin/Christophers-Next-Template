import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Protects /dashboard (requires auth) and redirects authenticated users
// away from /sign-in and /join to /dashboard.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (token && (pathname === '/sign-in' || pathname === '/join')) {
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
  matcher: ['/sign-in', '/join', '/dashboard', '/dashboard/:path*']
}
