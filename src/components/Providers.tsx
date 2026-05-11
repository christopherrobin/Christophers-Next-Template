'use client'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

/**
 * Root client-side provider tree.
 *
 * Wraps the app in `next-themes`' {@link ThemeProvider} (system theme
 * by default, persisted via the `class` attribute on `<html>`) and
 * NextAuth's {@link SessionProvider}.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
