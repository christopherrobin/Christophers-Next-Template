import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { SignOutButton } from './SignOutButton'

import { authOptions } from '@/lib/auth'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  const { email } = session.user

  return (
    <div className="px-4 py-6 fadeIn">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl">Dashboard</h1>
        <h2 className="font-bold text-blue-500 break-words">
          Welcome, {email}
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <pre
            className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto bg-stone-800 p-4 rounded-md w-full"
            data-testid="session-json"
          >
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
          <SignOutButton />
        </div>
      </main>
    </div>
  )
}
