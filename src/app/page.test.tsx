import { render, screen } from '@testing-library/react'

import Home from './page'

describe('Home page', () => {
  beforeEach(() => {
    render(<Home />)
  })

  it('renders the Howdy hero heading', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: /howdy/i })
    ).toBeInTheDocument()
  })

  it('renders a Sign Up link pointing to /sign-up', () => {
    const signUp = screen.getByRole('link', { name: /^sign up$/i })
    expect(signUp).toHaveAttribute('href', '/sign-up')
  })

  it('renders a Sign In link pointing to /sign-in', () => {
    const signIn = screen.getByRole('link', { name: /sign in/i })
    expect(signIn).toHaveAttribute('href', '/sign-in')
  })

  it('renders GitHub links with target=_blank and rel=noopener', () => {
    const githubLinks = screen.getAllByRole('link', {
      name: /github\.com\/christopherrobin/i
    })
    expect(githubLinks.length).toBeGreaterThan(0)
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel') ?? '').toMatch(/noopener/)
    })
  })
})
