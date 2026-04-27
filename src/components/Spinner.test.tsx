import { render, screen } from '@testing-library/react'
import React from 'react'

import Spinner from './Spinner'

describe('Spinner', () => {
  it('exposes a status role with an accessible "Loading" name', () => {
    render(<Spinner />)
    const status = screen.getByRole('status')
    expect(status).toHaveAccessibleName('Loading')
  })

  it('renders the animate-spin class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
