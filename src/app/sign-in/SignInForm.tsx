'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { signInSchema, type SignInInput } from '@/lib/schemas'

function isSafeRelativePath(value: string | null): value is string {
  if (!value) return false
  if (!value.startsWith('/')) return false
  if (value.startsWith('//')) return false
  if (value.startsWith('/\\')) return false
  return true
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async ({ email, password }: SignInInput) => {
    setServerError('')

    const requested = searchParams.get('callbackUrl')
    const callbackUrl = isSafeRelativePath(requested) ? requested : '/dashboard'

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })
      if (result?.error) {
        setServerError(result.error)
      } else if (result?.url) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-sm"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'sign-in-email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p
            id="sign-in-email-error"
            data-testid="sign-in-email-error"
            className="text-red-500 text-sm"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? 'sign-in-password-error' : undefined
          }
          {...register('password')}
        />
        {errors.password && (
          <p
            id="sign-in-password-error"
            data-testid="sign-in-password-error"
            className="text-red-500 text-sm"
          >
            {errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" loading={isSubmitting}>
        Sign In
      </Button>
      {serverError && (
        <div className="text-red-500" data-testid="sign-in-error">
          {serverError}
        </div>
      )}
      <div className="mt-4 text-center">
        <p className="text-gray-700 mt-3">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  )
}

export default SignInForm
