import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signOut } from 'next-auth/react'
import React from 'react'

import { SignOutButton } from './SignOutButton'

jest.mock('next-auth/react', () => ({
  signOut: jest.fn()
}))

const mockedSignOut = signOut as jest.Mock

describe('SignOutButton', () => {
  it('renders a Sign out button', () => {
    render(<SignOutButton />)
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('calls signOut when clicked', async () => {
    const user = userEvent.setup()
    render(<SignOutButton />)
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(mockedSignOut).toHaveBeenCalledTimes(1)
  })
})
