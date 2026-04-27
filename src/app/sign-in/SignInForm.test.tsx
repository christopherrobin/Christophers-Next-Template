import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React from 'react'

import SignInForm from './SignInForm'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn()
}))

const mockedSignIn = signIn as jest.Mock
const mockedUseSearchParams = useSearchParams as jest.Mock

const stubLocation = () => {
  const original = window.location
  const replacement = { href: '' } as unknown as Location
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: replacement
  })
  return () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: original
    })
  }
}

describe('SignInForm', () => {
  beforeEach(() => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams(''))
  })

  it('renders email, password, submit, and a link to /join', () => {
    render(<SignInForm />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    const joinLink = screen.getByRole('link', { name: /join now/i })
    expect(joinLink).toHaveAttribute('href', '/join')
  })

  it('submits the form with credentials', async () => {
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
    restore()
  })

  it('forwards a safe relative callbackUrl from the query string', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=/dashboard/settings')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard/settings' })
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard/settings'
      })
    })
    restore()
  })

  it('falls back to /dashboard when callbackUrl is an absolute URL', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=https://evil.com/x')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
    restore()
  })

  it('falls back to /dashboard when callbackUrl is protocol-relative', async () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('callbackUrl=//evil.com/x')
    )
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        email: 'a@b.com',
        password: 'pw',
        redirect: false,
        callbackUrl: '/dashboard'
      })
    })
    restore()
  })

  it('shows the error returned by signIn', async () => {
    mockedSignIn.mockResolvedValueOnce({ error: 'Invalid password' })
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Invalid password')).toBeInTheDocument()
  })

  it('navigates to the returned url on success', async () => {
    mockedSignIn.mockResolvedValueOnce({ url: '/dashboard' })
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(window.location.href).toBe('/dashboard')
    })
    restore()
  })

  it('disables the submit button while submitting', async () => {
    let resolveSignIn: (value: { url: string }) => void = () => {}
    mockedSignIn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve
        })
    )
    const restore = stubLocation()
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    const submit = screen.getByRole('button', { name: /sign in/i })
    await user.click(submit)
    await waitFor(() => {
      expect(submit).toBeDisabled()
    })
    resolveSignIn({ url: '/dashboard' })
    await waitFor(() => {
      expect(submit).not.toBeDisabled()
    })
    restore()
  })

  it('renders a generic error and logs when signIn throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedSignIn.mockRejectedValueOnce(new Error('network'))
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pw')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      await screen.findByText('An unexpected error occurred')
    ).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
