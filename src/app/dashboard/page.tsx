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
        <h1 className="text-2xl text-fg">Dashboard</h1>
        <h2 className="font-bold text-accent break-words">Welcome, {email}</h2>
        <div className="flex flex-col gap-4 w-full">
          {/* Debug-only session dump shipped with the starter so a forker
              can see the JWT shape. Remove before deploying to production. */}
          <pre
            className="text-sm text-fg/60 whitespace-pre-wrap overflow-x-auto bg-surface-elevated p-4 rounded-md w-full"
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
