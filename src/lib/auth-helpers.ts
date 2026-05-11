'use client'
import { signIn } from 'next-auth/react'

export type CredentialsSignInResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Client-side credentials sign-in shared between the sign-in form and
 * the post-sign-up auto-login flow.
 *
 * @remarks
 * Wraps `next-auth/react`'s {@link signIn} with the
 * `redirect: false` + manual `router.push(callbackUrl)` pattern so the
 * two call sites stay in lockstep on error handling and navigation.
 *
 * @param email - User-entered email (raw string; not validated here).
 * @param password - Plaintext password forwarded to the credentials provider.
 * @param callbackUrl - Destination after a successful sign-in. Defaults to `/dashboard`.
 */
export async function postCredentialsSignIn(
  email: string,
  password: string,
  callbackUrl = '/dashboard'
): Promise<CredentialsSignInResult> {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl
    })
    if (result?.error) return { ok: false, error: result.error }
    if (result?.url) return { ok: true }
    return { ok: false, error: 'Unexpected sign-in response' }
  } catch (err) {
    console.error('Sign in error:', err)
    return { ok: false, error: 'An unexpected error occurred' }
  }
}
