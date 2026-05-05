import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import React from 'react'

import Dashboard from './page'

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT')
  })
}))

// SignOutButton is a client island that uses next-auth/react. Stub it to
// keep this test focused on the server component's rendered output.
jest.mock('./SignOutButton', () => ({
  SignOutButton: () => <button type="button">Sign out</button>
}))

const mockedGetServerSession = getServerSession as jest.Mock
const mockedRedirect = redirect as unknown as jest.Mock

describe('Dashboard page (server component)', () => {
  it('greets the authenticated user and renders the session JSON', async () => {
    const session = {
      user: { id: 'u1', email: 'a@b.com', createdAt: '2024-01-01' },
      expires: 'never'
    }
    mockedGetServerSession.mockResolvedValue(session)

    const ui = await Dashboard()
    render(ui)

    expect(screen.getByText('Welcome, a@b.com')).toBeInTheDocument()
    expect(screen.getByText(/"a@b\.com"/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('redirects to /sign-in when no session is present', async () => {
    mockedGetServerSession.mockResolvedValue(null)

    await expect(Dashboard()).rejects.toThrow('NEXT_REDIRECT')
    expect(mockedRedirect).toHaveBeenCalledWith('/sign-in')
  })
})
