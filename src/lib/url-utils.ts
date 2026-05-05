/**
 * Strict relative-path validator for post-signin/post-action callback URLs.
 *
 * Returns true only for values that:
 *   - are non-empty strings
 *   - start with a single forward slash
 *   - do not start with `//` (protocol-relative — //evil.com)
 *   - do not start with `/\` (some browsers normalize \ to /)
 *   - contain no backslash, CR, or LF (header-splitting / scheme injection)
 *   - contain no `:` (blocks scheme injection like data:, javascript:)
 *
 * Used by sign-in flow to gate the `?callbackUrl=` param before passing it
 * to next-auth's signIn() / router.push(). Lifted out of SignInForm.tsx in
 * Phase 17 so it can be unit-tested in isolation and shared if other
 * surfaces need callback-URL validation.
 */
export function isSafeRelativePath(value: string | null): value is string {
  if (!value) return false
  if (!value.startsWith('/')) return false
  if (value.startsWith('//')) return false
  if (value.startsWith('/\\')) return false
  if (/[\\\r\n]/.test(value)) return false
  if (value.includes(':')) return false
  return true
}
