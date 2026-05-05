import React, { Suspense } from 'react'

import SignInForm from './SignInForm'

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fadeIn">
      <h1 className="text-2xl md:text-5xl font-bold text-blue-500 mb-8">
        Sign In
      </h1>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </div>
  )
}
