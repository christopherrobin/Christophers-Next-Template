import { expect, test } from '@playwright/test'

// Asserts the security-headers contract from next.config.ts. Catches any
// regression that drops a header without a matching test update — the
// other test layers don't exercise response headers.
test.describe('security headers', () => {
  test('homepage emits the full headers set', async ({ request }) => {
    const res = await request.get('/')
    expect(res.status()).toBe(200)

    const headers = res.headers()
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toBe(
      'max-age=63072000; includeSubDomains; preload'
    )
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['permissions-policy']).toContain('microphone=()')
    expect(headers['permissions-policy']).toContain('geolocation=()')
    expect(headers['permissions-policy']).toContain('interest-cohort=()')
  })

  test('CSP is enforcing (not Report-Only) and contains the expected directives', async ({
    request
  }) => {
    const res = await request.get('/')
    const csp = res.headers()['content-security-policy']
    expect(csp).toBeTruthy()
    // Report-Only header should NOT be present once Phase 14.2 enforcement
    // shipped.
    expect(res.headers()['content-security-policy-report-only']).toBeUndefined()

    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("style-src 'self' 'unsafe-inline'")
    expect(csp).toContain("img-src 'self' data: blob: https:")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).toContain("form-action 'self'")
  })
})
