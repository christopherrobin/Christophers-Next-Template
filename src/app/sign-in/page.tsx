'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

import SignInForm from './SignInForm'

export default function SignIn() {
  const { status } = useSession()
  const router = useRouter()

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
      <SignInForm />
    </div>
  )
}
