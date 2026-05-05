import { isSafeRelativePath } from './url-utils'

describe('isSafeRelativePath', () => {
  describe('accepts safe relative paths', () => {
    const cases = [
      '/',
      '/dashboard',
      '/dashboard/profile',
      '/dashboard?tab=settings',
      '/dashboard?foo=1&bar=2',
      '/sign-in?callbackUrl=%2Fdashboard',
      '/a/b/c/d',
      '/route#hash'
    ]
    it.each(cases)('%s', (input) => {
      expect(isSafeRelativePath(input)).toBe(true)
    })
  })

  describe('rejects unsafe / non-relative values', () => {
    const cases: [string, string | null][] = [
      ['null', null],
      ['empty string', ''],
      ['no leading slash', 'dashboard'],
      ['protocol-relative', '//evil.com'],
      ['protocol-relative with path', '//evil.com/dashboard'],
      ['backslash-prefixed', '/\\evil.com'],
      ['absolute http', 'http://evil.com'],
      ['absolute https', 'https://evil.com'],
      ['javascript scheme', 'javascript:alert(1)'],
      ['data scheme', 'data:text/html,<script>alert(1)</script>'],
      ['embedded backslash', '/path\\back'],
      ['embedded CR', '/path\rmalicious'],
      ['embedded LF', '/path\nmalicious'],
      ['embedded colon', '/path:8080'],
      ['scheme via colon mid-path', '/redirect:javascript:alert']
    ]
    it.each(cases)('rejects %s', (_label, input) => {
      expect(isSafeRelativePath(input)).toBe(false)
    })
  })
})
