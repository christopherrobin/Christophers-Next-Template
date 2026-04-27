import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React from 'react'

import SignIn from './page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

jest.mock('./SignInForm', () => {
  const Stub = () => <div data-testid="sign-in-form" />
  return { __esModule: true, default: Stub }
})

const mockedUseRouter = useRouter as jest.Mock
const mockedUseSession = useSession as jest.Mock

describe('SignIn page', () => {
  it('renders the heading and form when unauthenticated and does not redirect', () => {
    const replace = jest.fn()
    mockedUseRouter.mockReturnValue({ replace })
    mockedUseSession.mockReturnValue({
      status: 'unauthenticated',
      data: null
    })
    render(<SignIn />)
    expect(
      screen.getByRole('heading', { name: 'Sign In', level: 1 })
    ).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })

  it('renders the heading and form when loading and does not redirect', () => {
    const replace = jest.fn()
    mockedUseRouter.mockReturnValue({ replace })
    mockedUseSession.mockReturnValue({ status: 'loading', data: null })
    render(<SignIn />)
    expect(
      screen.getByRole('heading', { name: 'Sign In', level: 1 })
    ).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })

  it('does not redirect when authenticated (middleware handles that server-side)', () => {
    const replace = jest.fn()
    mockedUseRouter.mockReturnValue({ replace })
    mockedUseSession.mockReturnValue({
      status: 'authenticated',
      data: { user: { email: 'a@b.com' } }
    })
    render(<SignIn />)
    expect(replace).not.toHaveBeenCalled()
  })
})
