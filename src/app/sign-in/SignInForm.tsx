'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { postCredentialsSignIn } from '@/lib/auth-helpers'
import { signInSchema, type SignInInput } from '@/lib/schemas'
import { isSafeRelativePath } from '@/lib/url-utils'

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

    const result = await postCredentialsSignIn(email, password, callbackUrl)
    if (!result.ok) {
      setServerError(result.error)
      return
    }
    router.push(callbackUrl)
    router.refresh()
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
          label="Email"
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
          label="Password"
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
        <p className="text-white/70 mt-3">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-blue-400 underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  )
}

export default SignInForm
