import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React from 'react'

import SignInForm from './SignInForm'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

const mockedSignIn = signIn as jest.Mock
const mockedUseRouter = useRouter as jest.Mock
const mockedUseSearchParams = useSearchParams as jest.Mock

describe('SignInForm', () => {
  const push = jest.fn()
  const refresh = jest.fn()

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push, refresh })
    mockedUseSearchParams.mockReturnValue(new URLSearchParams(''))
  })

  it('renders email, password, submit, and a link to /sign-up', () => {
    render(<SignInForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    const signUpLink = screen.getByRole('link', { name: /sign up/i })
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })

  it('submits the form with credentials', async () => {
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
  })

  it('forwards a safe relative callbackUrl from the query string', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=/dashboard/settings')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard/settings' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard/settings'
      })
    })
  })

  it('falls back to /dashboard when callbackUrl is an absolute URL', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=https://evil.com/x')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
  })

  it('falls back to /dashboard when callbackUrl is protocol-relative', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=//evil.com/x')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
  })

  it('shows the error returned by signIn', async () => {
    mockedSignIn.mockResolvedValueOnce({ error: 'Invalid password' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Invalid password')).toBeInTheDocument()
  })

  it('navigates to the validated callbackUrl on success', async () => {
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard')
    })
    expect(refresh).toHaveBeenCalled()
  })

  it('disables the submit button while submitting', async () => {
    let resolveSignIn: (value: { url: string }) => void = () => {}
    mockedSignIn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve
        })
    )
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    const submit = screen.getByRole('button', { name: /sign in/i })
    await user.click(submit)
    await waitFor(() => {
      expect(submit).toBeDisabled()
    })
    resolveSignIn({ url: '/dashboard' })
    await waitFor(() => {
      expect(submit).not.toBeDisabled()
    })
  })

  it('renders a generic error and logs when signIn throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedSignIn.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      await screen.findByText('An unexpected error occurred')
    ).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
