'use client'
import { signOut, useSession } from 'next-auth/react'

import { Button } from '@/components/Button'
import Spinner from '@/components/Spinner'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { email } = session?.user || {}

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 fadeIn">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl">Dashboard</h1>
        <h2 className="font-bold text-blue-500 break-words">
          Welcome, {email}
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto bg-stone-800 p-4 rounded-md w-full">
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      </main>
    </div>
  )
}
