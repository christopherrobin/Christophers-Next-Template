'use client'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { Button } from '@/components/Button'
import Spinner from '@/components/Spinner'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { createdAt, emailVerified, email, id, updatedAt } = session?.user || {}
  const router = useRouter()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className="px-4 py-6 fadeIn">
        <main className="flex flex-col gap-4">
          <h1 className="text-2xl">Dashboard</h1>
          <h2 className="font-bold text-blue-500 break-words">
            Welcome, {email}
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto bg-stone-800 p-4 rounded-md w-full">
              <code>
                {JSON.stringify(
                  {
                    id,
                    email,
                    emailVerified,
                    createdAt: createdAt
                      ? new Date(createdAt).toLocaleString()
                      : 'N/A',
                    updatedAt: updatedAt
                      ? new Date(updatedAt).toLocaleString()
                      : 'N/A'
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-6 w-full"
          >
            Sign Out
          </Button>
        </main>
      </div>
    )
  }
}
