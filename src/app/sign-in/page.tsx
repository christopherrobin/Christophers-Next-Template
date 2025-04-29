'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import React, { Suspense, useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import Spinner from '@/components/Spinner'

// Create a separate component that uses useSearchParams
function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button type="submit" loading={loading}>
        Sign In
      </Button>
      {error && <div className="text-red-500">{error}</div>}

      <div className="mt-4 text-center">
        <p className="text-gray-700 mt-3">
          Don&apos;t have an account?{' '}
          <Link href="/join" className="text-blue-500 hover:underline">
            Join now
          </Link>
        </p>
      </div>
    </form>
  )
}

export default function SignIn() {
  const { status } = useSession()
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fadeIn">
      <h1 className="text-2xl md:text-5xl font-bold text-blue-500 mb-8">
        Sign In
      </h1>
      <Suspense fallback={<Spinner />}>
        <SignInForm />
      </Suspense>
    </div>
  )
}
