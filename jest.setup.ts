import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'node:util'

// jsdom 30 lacks TextEncoder/TextDecoder in some module-load paths;
// the `pg` driver (pulled in via @prisma/adapter-pg) needs them at
// require time for its SCRAM auth utilities. Polyfill before any
// import chain reaches pg's webcrypto utils.
if (!('TextEncoder' in globalThis)) {
  ;(globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
    TextEncoder
}
if (!('TextDecoder' in globalThis)) {
  ;(globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
    TextDecoder
}

if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn() as typeof window.scrollTo

  // jsdom doesn't implement matchMedia; next-themes reads it on mount
  // to resolve the `system` color scheme.
  if (!window.matchMedia) {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  }
}

class MockIntersectionObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  takeRecords = jest.fn(() => [])
  root = null
  rootMargin = ''
  thresholds = []
}

;(
  globalThis as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = MockIntersectionObserver
