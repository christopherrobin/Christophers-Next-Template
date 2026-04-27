import '@testing-library/jest-dom'

if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn() as typeof window.scrollTo

  const originalLocation = window.location
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...originalLocation, href: originalLocation?.href ?? '' }
  })
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
