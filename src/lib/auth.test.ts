import { compare } from 'bcryptjs'

import { authOptions } from './auth'
import { prisma } from './prisma'

import { makeUser } from '@/test-utils/factories'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}))

const mockedFindUnique = prisma.user.findUnique as jest.Mock
const mockedCompare = compare as jest.Mock

type CredentialsAuthorize = (
  credentials: Record<string, string> | undefined
) => Promise<unknown>

const getAuthorize = (): CredentialsAuthorize => {
  const provider = authOptions.providers[0] as unknown as {
    options: { authorize: CredentialsAuthorize }
  }
  return provider.options.authorize.bind(provider)
}

describe('authOptions.providers[0].authorize', () => {
  it('throws when email is missing', async () => {
    const authorize = getAuthorize()
    await expect(authorize({ password: 'pw' })).rejects.toThrow(
      'Invalid email or password'
    )
  })

  it('throws when password is missing', async () => {
    const authorize = getAuthorize()
    await expect(authorize({ email: 'a@b.com' })).rejects.toThrow(
      'Invalid email or password'
    )
  })

  it('throws when credentials are undefined', async () => {
    const authorize = getAuthorize()
    await expect(authorize(undefined)).rejects.toThrow(
      'Invalid email or password'
    )
  })

  it('throws when no user is found', async () => {
    mockedFindUnique.mockResolvedValueOnce(null)
    const authorize = getAuthorize()
    await expect(
      authorize({ email: 'a@b.com', password: 'pw' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('throws when password does not match', async () => {
    mockedFindUnique.mockResolvedValueOnce(
      makeUser({
        id: '1',
        email: 'a@b.com',
        password: 'hashed',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z')
      })
    )
    mockedCompare.mockResolvedValueOnce(false)
    const authorize = getAuthorize()
    await expect(
      authorize({ email: 'a@b.com', password: 'pw' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('returns user payload with ISO date strings on success', async () => {
    const created = new Date('2025-01-01T00:00:00.000Z')
    const updated = new Date('2025-01-02T00:00:00.000Z')
    const verified = new Date('2025-01-03T00:00:00.000Z')
    mockedFindUnique.mockResolvedValueOnce(
      makeUser({
        id: '42',
        email: 'a@b.com',
        password: 'hashed',
        createdAt: created,
        updatedAt: updated,
        emailVerified: verified
      })
    )
    mockedCompare.mockResolvedValueOnce(true)
    const authorize = getAuthorize()
    const result = await authorize({ email: 'a@b.com', password: 'pw' })
    expect(result).toEqual({
      id: '42',
      email: 'a@b.com',
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
      emailVerified: verified.toISOString()
    })
    expect(mockedCompare).toHaveBeenCalledWith('pw', 'hashed')
  })

  it('returns null emailVerified when unverified', async () => {
    const created = new Date('2025-01-01T00:00:00.000Z')
    const updated = new Date('2025-01-02T00:00:00.000Z')
    mockedFindUnique.mockResolvedValueOnce(
      makeUser({
        id: '7',
        email: 'a@b.com',
        password: 'hashed',
        createdAt: created,
        updatedAt: updated,
        emailVerified: null
      })
    )
    mockedCompare.mockResolvedValueOnce(true)
    const authorize = getAuthorize()
    const result = (await authorize({
      email: 'a@b.com',
      password: 'pw'
    })) as { emailVerified: string | null }
    expect(result.emailVerified).toBeNull()
  })
})

describe('authOptions.callbacks.jwt', () => {
  it('copies emailVerified, updatedAt, createdAt from user on first call', async () => {
    const jwt = authOptions.callbacks!.jwt!
    const token = { sub: '1' } as Record<string, unknown>
    const user = {
      id: '1',
      email: 'a@b.com',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
      emailVerified: '2025-01-03T00:00:00.000Z'
    }
    const result = (await jwt({
      token,
      user,
      account: null
    } as Parameters<typeof jwt>[0])) as Record<string, unknown>
    expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z')
    expect(result.updatedAt).toBe('2025-01-02T00:00:00.000Z')
    expect(result.emailVerified).toBe('2025-01-03T00:00:00.000Z')
  })

  it('is a no-op when user is undefined', async () => {
    const jwt = authOptions.callbacks!.jwt!
    const token = {
      sub: '1',
      createdAt: 'pre-existing'
    } as Record<string, unknown>
    const result = (await jwt({
      token,
      account: null
    } as Parameters<typeof jwt>[0])) as Record<string, unknown>
    expect(result).toEqual(token)
  })
})

describe('authOptions.callbacks.session', () => {
  it('throws when token.sub is missing', async () => {
    const session = authOptions.callbacks!.session!
    await expect(
      session({
        session: { user: { email: 'a@b.com' } },
        token: {}
      } as unknown as Parameters<typeof session>[0])
    ).rejects.toThrow('Invalid session')
  })

  it('merges id, emailVerified, createdAt, updatedAt onto session.user', async () => {
    const session = authOptions.callbacks!.session!
    const result = (await session({
      session: { user: { email: 'a@b.com' }, expires: 'never' },
      token: {
        sub: 'user-1',
        emailVerified: '2025-01-03T00:00:00.000Z',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z'
      }
    } as unknown as Parameters<typeof session>[0])) as {
      user: Record<string, unknown>
    }
    expect(result.user).toEqual({
      email: 'a@b.com',
      id: 'user-1',
      emailVerified: '2025-01-03T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    })
  })
})
