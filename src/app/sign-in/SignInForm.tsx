import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

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
          <a href="/join" className="text-blue-500 hover:underline">
            Join now
          </a>
        </p>
      </div>
    </form>
  )
}

export default SignInForm
