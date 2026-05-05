/**
 * @jest-environment node
 */
import { getToken } from 'next-auth/jwt'

import { proxy } from './proxy'

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn()
}))

const mockedGetToken = getToken as jest.Mock

const buildRequest = (pathname: string, search = '') => {
  const url = `http://localhost:3000${pathname}${search}`
  return {
    nextUrl: { pathname, search },
    url,
    headers: new Headers(),
    cookies: { get: () => undefined }
  } as unknown as Parameters<typeof proxy>[0]
}

describe('proxy', () => {
  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = 'test-secret'
  })

  it('redirects authed users away from /sign-in to /dashboard', async () => {
    mockedGetToken.mockResolvedValueOnce({ sub: 'user-1' })
    const res = await proxy(buildRequest('/sign-in'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard')
  })

  it('redirects authed users away from /sign-up to /dashboard', async () => {
    mockedGetToken.mockResolvedValueOnce({ sub: 'user-1' })
    const res = await proxy(buildRequest('/sign-up'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard')
  })

  it('redirects anon users from /dashboard to /sign-in with callbackUrl', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const res = await proxy(buildRequest('/dashboard'))
    expect(res.status).toBe(307)
    const location = res.headers.get('location')!
    const parsed = new URL(location)
    expect(parsed.pathname).toBe('/sign-in')
    expect(parsed.searchParams.get('callbackUrl')).toBe('/dashboard')
  })

  it('redirects anon users from /dashboard/settings to /sign-in with callbackUrl', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const res = await proxy(buildRequest('/dashboard/settings'))
    expect(res.status).toBe(307)
    const location = res.headers.get('location')!
    const parsed = new URL(location)
    expect(parsed.pathname).toBe('/sign-in')
    expect(parsed.searchParams.get('callbackUrl')).toBe('/dashboard/settings')
  })

  it('preserves query string in callbackUrl', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const res = await proxy(buildRequest('/dashboard', '?foo=1'))
    expect(res.status).toBe(307)
    const parsed = new URL(res.headers.get('location')!)
    expect(parsed.searchParams.get('callbackUrl')).toBe('/dashboard?foo=1')
  })

  it('lets anon users through to /sign-in', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const res = await proxy(buildRequest('/sign-in'))
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  it('lets anon users through to /sign-up', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const res = await proxy(buildRequest('/sign-up'))
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  it('lets authed users through to /dashboard', async () => {
    mockedGetToken.mockResolvedValueOnce({ sub: 'user-1' })
    const res = await proxy(buildRequest('/dashboard'))
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  it('calls getToken with req and NEXTAUTH_SECRET', async () => {
    mockedGetToken.mockResolvedValueOnce(null)
    const req = buildRequest('/sign-in')
    await proxy(req)
    expect(mockedGetToken).toHaveBeenCalledWith({
      req,
      secret: 'test-secret'
    })
  })
})
