import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ThemeProvider } from 'next-themes'

import { ThemeToggle } from './ThemeToggle'

const STORAGE_KEY = 'theme'

const renderWithProvider = () =>
  render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={STORAGE_KEY}
    >
      <ThemeToggle />
    </ThemeProvider>
  )

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders three theme buttons once mounted', async () => {
    renderWithProvider()
    const system = await screen.findByRole('button', { name: 'System' })
    expect(system).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Light' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Dark' })).toBeEnabled()
  })

  it('marks System as active by default', async () => {
    renderWithProvider()
    const system = await screen.findByRole('button', { name: 'System' })
    // Wait for next-themes to hydrate `theme` (button starts disabled).
    await screen.findByRole('button', { name: 'System', pressed: true })
    expect(system).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to Light when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    const light = await screen.findByRole('button', { name: 'Light' })
    await screen.findByRole('button', { name: 'System', pressed: true })
    await user.click(light)
    expect(light).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to Dark when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    const dark = await screen.findByRole('button', { name: 'Dark' })
    await screen.findByRole('button', { name: 'System', pressed: true })
    await user.click(dark)
    expect(dark).toHaveAttribute('aria-pressed', 'true')
  })

  it('persists choice to localStorage under the configured storageKey', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    await user.click(screen.getByRole('button', { name: 'Dark' }))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })
})
