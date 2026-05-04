'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { joinSchema, type JoinInput } from '@/lib/schemas'

export default function Join() {
  const { status } = useSession()
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<JoinInput>({
    resolver: zodResolver(joinSchema)
  })

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const onSubmit = async ({ email, password }: JoinInput) => {
    setServerError('')

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/dashboard'
        })

        if (signInResult?.error) {
          setServerError(signInResult.error)
        } else if (signInResult?.url) {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        setServerError(data.error || 'Failed to create account')
      }
    } catch (err) {
      console.error('Join error:', err)
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fadeIn">
      <h1 className="text-2xl md:text-5xl font-bold text-blue-500 mb-8">
        Join the Club
      </h1>
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
            aria-describedby={errors.email ? 'join-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p
              id="join-email-error"
              data-testid="join-email-error"
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
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'join-password-error' : undefined
            }
            {...register('password')}
          />
          {errors.password && (
            <p
              id="join-password-error"
              data-testid="join-password-error"
              className="text-red-500 text-sm"
            >
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Joining...' : 'Join'}
        </Button>
        {serverError && (
          <div className="text-red-500" data-testid="join-error">
            {serverError}
          </div>
        )}
      </form>
      <p className="text-gray-700 mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
