import { signIn } from 'next-auth/react'

import { postCredentialsSignIn } from './auth-helpers'

jest.mock('next-auth/react', () => ({ signIn: jest.fn() }))

const mockedSignIn = jest.mocked(signIn)

describe('postCredentialsSignIn', () => {
  beforeEach(() => mockedSignIn.mockReset())

  it('returns ok:true on a successful signIn (result.url present)', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: '/dashboard',
      code: undefined
    } as never)
    const result = await postCredentialsSignIn('a@b.com', 'pw', '/dashboard')
    expect(result).toEqual({ ok: true })
    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: 'a@b.com',
      password: 'pw',
      redirect: false,
      callbackUrl: '/dashboard'
    })
  })

  it('defaults callbackUrl to /dashboard when omitted', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: '/dashboard',
      code: undefined
    } as never)
    await postCredentialsSignIn('a@b.com', 'pw')
    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: 'a@b.com',
      password: 'pw',
      redirect: false,
      callbackUrl: '/dashboard'
    })
  })

  it('returns ok:false with the signIn error message', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'Invalid email or password',
      status: 401,
      url: null,
      code: 'CredentialsSignin'
    } as never)
    const result = await postCredentialsSignIn('a@b.com', 'wrong')
    expect(result).toEqual({
      ok: false,
      error: 'Invalid email or password'
    })
  })

  it('returns ok:false with "Unexpected sign-in response" when neither error nor url present', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: null,
      code: undefined
    } as never)
    const result = await postCredentialsSignIn('a@b.com', 'pw')
    expect(result).toEqual({
      ok: false,
      error: 'Unexpected sign-in response'
    })
  })

  it('returns ok:false with "An unexpected error occurred" when signIn throws', async () => {
    mockedSignIn.mockRejectedValueOnce(new Error('network down'))
    const result = await postCredentialsSignIn('a@b.com', 'pw')
    expect(result).toEqual({
      ok: false,
      error: 'An unexpected error occurred'
    })
  })
})
