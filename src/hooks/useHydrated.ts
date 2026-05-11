import { useSyncExternalStore } from 'react'

// Module-scope so the subscribe reference is stable across renders and
// doesn't trigger re-subscribe churn in useSyncExternalStore.
const emptySubscribe = () => () => {}

// Returns false during SSR and the first client render, then true after
// hydration. Canonical React 19 replacement for the
// `useState + useEffect(() => setMounted(true))` pattern, which now
// trips the `react-hooks/set-state-in-effect` lint rule.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
