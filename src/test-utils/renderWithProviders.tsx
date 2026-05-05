import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionProvider } from 'next-auth/react'
import type { ReactElement, ReactNode } from 'react'

import { makeSession } from './factories'

interface ProvidersProps {
  children: ReactNode
}

function AllProviders({ children }: ProvidersProps) {
  return <SessionProvider session={null}>{children}</SessionProvider>
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export function renderWithSession(
  ui: ReactElement,
  sessionOverrides?: Parameters<typeof makeSession>[0],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const session = makeSession(sessionOverrides)
  function Wrapper({ children }: ProvidersProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

export function setupUser() {
  return userEvent.setup()
}

export * from '@testing-library/react'
