import { useSyncExternalStore } from 'react'

// Module-scope keeps the subscribe reference stable across renders;
// otherwise React would re-subscribe on every render.
const emptySubscribe = () => () => {}

/**
 * Returns `false` during SSR and the first client render, then `true`
 * after hydration completes.
 *
 * @remarks
 * Built on {@link useSyncExternalStore}, which makes the transition
 * part of hydration. Prefer this over the
 * `useState + useEffect(() => setMounted(true))` shape — the
 * `react-hooks/set-state-in-effect` rule flags that pattern.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
