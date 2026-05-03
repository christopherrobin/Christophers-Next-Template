/**
 * @jest-environment node
 */
import { hash } from 'bcryptjs'

import { POST } from './route'

import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}))

const mockedFindUnique = prisma.user.findUnique as jest.Mock
const mockedCreate = prisma.user.create as jest.Mock
const mockedHash = hash as jest.Mock

const buildRequest = (body: unknown) =>
  new Request('http://localhost/api/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }) as unknown as Parameters<typeof POST>[0]

describe('POST /api/join', () => {
  it('returns 400 when email is missing', async () => {
    const res = await POST(buildRequest({ password: 'pw' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Missing email or password'
    })
  })

  it('returns 400 when password is missing', async () => {
    const res = await POST(buildRequest({ email: 'a@b.com' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      error: 'Missing email or password'
    })
  })

  it('returns 400 when user already exists', async () => {
    mockedFindUnique.mockResolvedValueOnce({ id: '1', email: 'a@b.com' })
    const res = await POST(buildRequest({ email: 'a@b.com', password: 'pw' }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'User already exists' })
  })

  it('creates a user with a hashed password and returns 200', async () => {
    mockedFindUnique.mockResolvedValueOnce(null)
    mockedHash.mockResolvedValueOnce('hashed-pw')
    mockedCreate.mockResolvedValueOnce({ id: '1', email: 'a@b.com' })
    const res = await POST(buildRequest({ email: 'a@b.com', password: 'pw' }))
    expect(mockedHash).toHaveBeenCalledWith('pw', 10)
    expect(mockedCreate).toHaveBeenCalledWith({
      data: { email: 'a@b.com', password: 'hashed-pw' }
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
  })

  it('returns 500 when prisma.user.create throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedFindUnique.mockResolvedValueOnce(null)
    mockedHash.mockResolvedValueOnce('hashed-pw')
    mockedCreate.mockRejectedValueOnce(new Error('boom'))
    const res = await POST(buildRequest({ email: 'a@b.com', password: 'pw' }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error'
    })
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('returns 500 when the body is malformed', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const malformed = new Request('http://localhost/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json'
    }) as unknown as Parameters<typeof POST>[0]
    const res = await POST(malformed)
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error'
    })
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
