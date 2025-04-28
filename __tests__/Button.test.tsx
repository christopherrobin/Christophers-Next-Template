import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import { Button } from '../src/components/Button'

const icon = <svg data-testid="icon" />

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('renders as a link if href is provided', () => {
    const { getByRole } = render(<Button href="/test">Link Button</Button>)
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveTextContent('Link Button')
  })

  it('renders as a button if href is not provided', () => {
    const { getByRole } = render(<Button>Button</Button>)
    const button = getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('disables button when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>)
    const button = getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    const { getByRole, container } = render(<Button loading>Loading</Button>)
    expect(getByRole('button')).toBeDisabled()
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders startIcon and endIcon', () => {
    const { getAllByTestId } = render(
      <Button startIcon={icon} endIcon={icon}>
        With Icons
      </Button>
    )
    expect(getAllByTestId('icon')).toHaveLength(2)
  })

  it('applies ghost styles when ghost prop is true', () => {
    const { getByRole } = render(<Button ghost>Ghost</Button>)
    const button = getByRole('button')
    expect(button.className).toMatch(/border-blue-500/)
  })
})
