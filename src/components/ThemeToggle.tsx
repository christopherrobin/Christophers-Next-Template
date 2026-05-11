'use client'
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'

import { useHydrated } from '@/hooks/useHydrated'

type ThemeValue = 'system' | 'light' | 'dark'

const OPTIONS: ReadonlyArray<{
  value: ThemeValue
  label: string
  Icon: typeof ComputerDesktopIcon
}> = [
  { value: 'system', label: 'System', Icon: ComputerDesktopIcon },
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon }
]

const CONTAINER_CLASSES =
  'fixed top-4 right-4 z-50 flex items-center gap-0.5 rounded-full border border-fg/10 bg-surface-elevated p-0.5'

/**
 * Fixed-position System / Light / Dark toggle.
 *
 * Reads and writes the active theme through `next-themes`. Buttons are
 * disabled until {@link useHydrated} flips true so the pressed state
 * doesn't briefly disagree with the inline pre-hydration script's
 * choice on first paint.
 */
export function ThemeToggle() {
  const mounted = useHydrated()
  const { theme, setTheme } = useTheme()

  // Render real markup pre-mount with no active state — preserves layout
  // (no hydration jump) and stays inert until next-themes resolves.
  // next-themes sets <html class="dark"> from an inline pre-hydration
  // script, so the page is already in the correct theme before this
  // component hydrates; we just can't reflect the active button yet.
  const current: ThemeValue | null = mounted
    ? ((theme as ThemeValue | undefined) ?? 'system')
    : null

  return (
    <div
      className={CONTAINER_CLASSES}
      aria-hidden={!mounted ? true : undefined}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = current === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            disabled={!mounted}
            onClick={() => setTheme(value)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              active
                ? 'bg-accent text-on-accent'
                : 'text-fg/60 hover:text-fg hover:bg-fg/5'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}
