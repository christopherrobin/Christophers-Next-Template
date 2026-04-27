import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { Input } from './Input'

describe('Input', () => {
  it('renders with default Tailwind classes', () => {
    render(<Input placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input.className).toMatch(/p-4/)
    expect(input.className).toMatch(/rounded/)
    expect(input.className).toMatch(/bg-white/)
  })

  it('forwards the ref to the underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="Email" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('spreads HTML props onto the input element', () => {
    render(
      <Input
        type="email"
        placeholder="Email"
        defaultValue="hello@example.com"
        autoComplete="email"
        required
        data-testid="email-input"
      />
    )
    const input = screen.getByTestId('email-input') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Email')
    expect(input).toHaveAttribute('autocomplete', 'email')
    expect(input).toBeRequired()
    expect(input.value).toBe('hello@example.com')
  })

  it('merges a custom className with default classes', () => {
    render(<Input placeholder="Email" className="border-red-500" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input.className).toMatch(/p-4/)
    expect(input.className).toMatch(/border-red-500/)
  })

  it('fires onChange while the user types', async () => {
    const onChange = jest.fn()
    const user = userEvent.setup()
    render(<Input placeholder="Email" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('Email'), 'hi')
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
