'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { postCredentialsSignIn } from '@/lib/auth-helpers'
import { signUpSchema, type SignUpInput } from '@/lib/schemas'

export default function SignUp() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async ({ email, password }: SignUpInput) => {
    setServerError('')

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Failed to create account')
        return
      }

      const result = await postCredentialsSignIn(email, password)
      if (!result.ok) {
        setServerError(result.error)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Sign-up error:', err)
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fadeIn">
      <h1 className="text-2xl md:text-5xl font-bold text-blue-500 mb-8">
        Sign Up
      </h1>
      <form
        className="flex flex-col gap-4 w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-1">
          <Input
            type="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'sign-up-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p
              id="sign-up-email-error"
              data-testid="sign-up-email-error"
              className="text-red-500 text-sm"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            type="password"
            label="Password"
            placeholder="Password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'sign-up-password-error' : undefined
            }
            {...register('password')}
          />
          {errors.password && (
            <p
              id="sign-up-password-error"
              data-testid="sign-up-password-error"
              className="text-red-500 text-sm"
            >
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
        {serverError && (
          <div className="text-red-500" data-testid="sign-up-error">
            {serverError}
          </div>
        )}
      </form>
      <p className="text-white/70 mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-400 underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
