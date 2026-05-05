import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React from 'react'

import SignUp from './page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}))

const mockedUseRouter = useRouter as jest.Mock
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

describe('SignUp page', () => {
  const push = jest.fn()
  const refresh = jest.fn()
  const replace = jest.fn()

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push, replace, refresh })
  })

  it('renders the form fields, submit button, and link to /sign-in', () => {
    render(<SignUp />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/sign-in'
    )
  })

  it('creates the account and signs in on success', async () => {
    mockFetchOk({ ok: true })
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<SignUp />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'ChrisIsTheBest42!')
    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'a@b.com',
          password: 'ChrisIsTheBest42!'
        })
      })
    })
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'ChrisIsTheBest42!',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard')
    })
    expect(refresh).toHaveBeenCalled()
  })

  it('shows the API error and skips signIn when /api/sign-up fails', async () => {
    mockFetchError({ error: 'User already exists' })
    const user = userEvent.setup()
    render(<SignUp />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'ChrisIsTheBest42!')
    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
    expect(await screen.findByText('User already exists')).toBeInTheDocument()
    expect(mockedSignIn).not.toHaveBeenCalled()
  })

  it('shows the signIn error when signIn fails after a successful sign-up', async () => {
    mockFetchOk({ ok: true })
    mockedSignIn.mockResolvedValueOnce({ error: 'Invalid password' })
    const user = userEvent.setup()
    render(<SignUp />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'ChrisIsTheBest42!')
    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
    expect(await screen.findByText('Invalid password')).toBeInTheDocument()
  })

  it('shows a generic error and logs when fetch throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetchThrow()
    const user = userEvent.setup()
    render(<SignUp />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'ChrisIsTheBest42!')
    await user.click(screen.getByRole('button', { name: 'Sign Up' }))
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
    render(<SignUp />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'ChrisIsTheBest42!')
    const submit = screen.getByRole('button', { name: 'Sign Up' })
    await user.click(submit)
    await waitFor(() => {
      expect(submit).toBeDisabled()
    })
    expect(
      screen.queryByRole('button', { name: 'Sign Up' })
    ).not.toBeInTheDocument()
    resolveFetch({ ok: true, json: () => Promise.resolve({ ok: true }) })
    await waitFor(() => {
      expect(submit).not.toBeDisabled()
    })
  })
})
