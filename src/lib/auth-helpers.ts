'use client'
import { signIn } from 'next-auth/react'

// Shared client-side helper used by both the sign-in form and the post-
// sign-up auto-login flow. Wraps `next-auth/react`'s `signIn` with our
// `redirect: false` + manual `router.push(callbackUrl)` pattern so the two
// call sites stay in lockstep.

export type CredentialsSignInResult =
  | { ok: true }
  | { ok: false; error: string }

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
