import { render, screen } from '@testing-library/react'

import NotFound from './not-found'

describe('NotFound page', () => {
  beforeEach(() => {
    render(<NotFound />)
  })

  it('renders the 404 heading', () => {
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument()
  })

  it('renders the apology copy', () => {
    expect(
      screen.getByText(/sorry, the page you are looking for/i)
    ).toBeInTheDocument()
  })

  it('renders a Go Home link to /', () => {
    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
