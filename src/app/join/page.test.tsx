import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import React from 'react'

import Join from './page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn()
}))

const mockedUseRouter = useRouter as jest.Mock
const mockedUseSession = useSession as jest.Mock
const mockedSignIn = signIn as jest.Mock

const mockFetchOk = (body: unknown) => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(body)
  }) as unknown as typeof fetch
}

const mockFetchError = (body: unknown) => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve(body)
  }) as unknown as typeof fetch
}

const mockFetchThrow = () => {
  global.fetch = jest
    .fn()
    .mockRejectedValueOnce(new Error('network')) as unknown as typeof fetch
}

describe('Join page', () => {
  const push = jest.fn()
  const refresh = jest.fn()
  const replace = jest.fn()

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push, replace, refresh })
    mockedUseSession.mockReturnValue({ status: 'unauthenticated', data: null })
  })

  it('redirects to /dashboard when authenticated', () => {
    mockedUseSession.mockReturnValue({
      status: 'authenticated',
      data: { user: { email: 'a@b.com' } }
    })
    render(<Join />)
    expect(replace).toHaveBeenCalledWith('/dashboard')
  })

  it('renders the form fields, submit button, and link to /sign-in', () => {
    render(<Join />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/sign-in'
    )
  })

  it('creates the account and signs in on success', async () => {
    mockFetchOk({ ok: true })
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<Join />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: 'Join' }))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@b.com', password: 'pw' })
      })
    })
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard')
    })
    expect(refresh).toHaveBeenCalled()
  })

  it('shows the API error and skips signIn when /api/join fails', async () => {
    mockFetchError({ error: 'User already exists' })
    const user = userEvent.setup()
    render(<Join />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: 'Join' }))
    expect(await screen.findByText('User already exists')).toBeInTheDocument()
    expect(mockedSignIn).not.toHaveBeenCalled()
  })

  it('shows the signIn error when signIn fails after a successful join', async () => {
    mockFetchOk({ ok: true })
    mockedSignIn.mockResolvedValueOnce({ error: 'Invalid password' })
    const user = userEvent.setup()
    render(<Join />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: 'Join' }))
    expect(await screen.findByText('Invalid password')).toBeInTheDocument()
  })

  it('shows a generic error and logs when fetch throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetchThrow()
    const user = userEvent.setup()
    render(<Join />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: 'Join' }))
    expect(
      await screen.findByText('An unexpected error occurred')
    ).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('disables the button and switches it into loading state while submitting', async () => {
    let resolveFetch: (value: {
      ok: boolean
      json: () => Promise<unknown>
    }) => void = () => {}
    global.fetch = jest.fn().mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        })
    ) as unknown as typeof fetch
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<Join />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    const submit = screen.getByRole('button', { name: 'Join' })
    await user.click(submit)
    await waitFor(() => {
      expect(submit).toBeDisabled()
    })
    expect(
      screen.queryByRole('button', { name: 'Join' })
    ).not.toBeInTheDocument()
    resolveFetch({ ok: true, json: () => Promise.resolve({ ok: true }) })
    await waitFor(() => {
      expect(submit).not.toBeDisabled()
    })
  })
})
