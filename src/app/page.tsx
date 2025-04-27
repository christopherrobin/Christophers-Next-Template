'use client'
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

import { Button } from '@/components/Button'

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className="grid grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen px-6 gap-16 fadeIn">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start sm:w-full md:w-2/3 text-center sm:text-left">
        <h1>Howdy.</h1>
        <h2>Christophers-Next-Template</h2>
        <p>
          This is a template for Next.js applications with TypeScript, Tailwind
          CSS, and NextAuth.js. It includes a simple authentication flow, a
          protected dashboard, and reusable components to kickstart your
          project.
        </p>
        <Button
          href="/join"
          className="self-center mt-2 w-full"
          endIcon={<RocketLaunchIcon className="w-5 h-5" />}
        >
          Join Us
        </Button>
        <Button
          href="/sign-in"
          className="self-center w-full"
          endIcon={<ArrowRightCircleIcon className="w-5 h-5 text-blue-500" />}
          ghost
        >
          Sign In
        </Button>
      </main>
    </div>
  )
}
