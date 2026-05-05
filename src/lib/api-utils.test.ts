/**
 * @jest-environment node
 */
import { getServerSession } from 'next-auth'

import { errorResponse, requireAuth, validationError } from './api-utils'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {}
}))

const mockedGetServerSession = jest.mocked(getServerSession)

describe('errorResponse', () => {
  it('returns the supplied message + default 400 status', async () => {
    const res = errorResponse('Something broke')
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Something broke' })
  })

  it('honors a custom status code', async () => {
    const res = errorResponse('Forbidden', 403)
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({ error: 'Forbidden' })
  })
})

describe('validationError', () => {
  it('returns 400 with the canonical "Invalid input" wrapper + details', async () => {
    const res = validationError({
      email: ['Invalid email'],
      password: ['Too short']
    })
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Invalid input',
      details: { email: ['Invalid email'], password: ['Too short'] }
    })
  })
})

describe('requireAuth', () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset()
  })

  it('returns 401 error when getServerSession resolves to null', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null)
    const result = await requireAuth()
    expect('error' in result).toBe(true)
    if ('error' in result) {
      expect(result.error.status).toBe(401)
      await expect(result.error.json()).resolves.toEqual({
        error: 'Unauthorized'
      })
    }
  })

  it('returns 401 error when session.user lacks an id property', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { email: 'a@b.com' },
      expires: '2099'
    } as never)
    const result = await requireAuth()
    expect('error' in result).toBe(true)
  })

  it('returns 401 error when session.user.id is empty string', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: '', email: 'a@b.com' },
      expires: '2099'
    } as never)
    const result = await requireAuth()
    expect('error' in result).toBe(true)
  })

  it('returns session + userId on a fully populated session', async () => {
    const session = {
      user: { id: 'u-123', email: 'a@b.com' },
      expires: '2099'
    }
    mockedGetServerSession.mockResolvedValueOnce(session as never)
    const result = await requireAuth()
    expect('error' in result).toBe(false)
    if (!('error' in result)) {
      expect(result.userId).toBe('u-123')
      expect(result.session).toBe(session)
    }
  })
})
