import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react'

import { Button } from './Button'

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

  it('fires onClick when not disabled or loading', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    )
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not fire onClick when loading', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()
    render(
      <Button loading onClick={onClick}>
        Click
      </Button>
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a link with pointer-events-none when href is provided and disabled', () => {
    render(
      <Button href="/foo" disabled>
        Disabled Link
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Disabled Link' })
    expect(link.className).toMatch(/pointer-events-none/)
  })

  it('renders a link with pointer-events-none when href is provided and loading', () => {
    render(
      <Button href="/foo" loading>
        Loading Link
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Loading Link' })
    expect(link.className).toMatch(/pointer-events-none/)
  })

  it('forwards target and rel onto the rendered Link', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener">
        External
      </Button>
    )
    const link = screen.getByRole('link', { name: 'External' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener')
  })

  it('forwards type="submit" to the underlying button', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit'
    )
  })
})
