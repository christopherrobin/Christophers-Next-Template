'use client'
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] fadeIn">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/plant.svg"
          alt="Plant Logo"
          width={180}
          height={180}
          className="mx-auto w-[180px] h-[180px]"
          priority
        />
        <h1 className="text-2xl md:text-5xl font-bold text-green-700">
          Howdy.
        </h1>
        <Button
          href="/join"
          className="self-center mt-2"
          endIcon={<RocketLaunchIcon className="w-5 h-5" />}
        >
          Join Us
        </Button>
        <Button
          href="/sign-in"
          className="self-center"
          endIcon={<ArrowRightCircleIcon className="w-5 h-5 text-green-700" />}
          ghost
        >
          Sign In
        </Button>
      </main>
    </div>
  )
}
