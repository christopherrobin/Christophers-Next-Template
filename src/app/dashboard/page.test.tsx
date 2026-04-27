import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

import Dashboard from './page'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn()
}))

const mockedUseSession = useSession as jest.Mock
const mockedSignOut = signOut as jest.Mock

describe('Dashboard page', () => {
  it('renders the spinner while loading', () => {
    mockedUseSession.mockReturnValue({ data: null, status: 'loading' })
    render(<Dashboard />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('greets the authenticated user and renders the session JSON', () => {
    const session = { user: { email: 'a@b.com' }, expires: 'never' }
    mockedUseSession.mockReturnValue({ data: session, status: 'authenticated' })
    render(<Dashboard />)
    expect(screen.getByText('Welcome, a@b.com')).toBeInTheDocument()
    expect(screen.getByText(/"a@b\.com"/)).toBeInTheDocument()
  })

  it('calls signOut when Sign out is clicked', async () => {
    mockedUseSession.mockReturnValue({
      data: { user: { email: 'a@b.com' }, expires: 'never' },
      status: 'authenticated'
    })
    const user = userEvent.setup()
    render(<Dashboard />)
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(mockedSignOut).toHaveBeenCalledTimes(1)
  })

  it('does not crash when session.user is missing', () => {
    mockedUseSession.mockReturnValue({
      data: { expires: 'never' },
      status: 'authenticated'
    })
    expect(() => render(<Dashboard />)).not.toThrow()
    expect(screen.getByText(/Welcome,/)).toBeInTheDocument()
  })
})
