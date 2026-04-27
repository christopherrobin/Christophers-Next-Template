import { expect, test } from '@playwright/test'

import { signIn } from './helpers/auth'
import { seedUser } from './helpers/db'

const EMAIL = 'signout@test.dev'
const PASSWORD = 'BuhBye42!'

test.describe('sign-out flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: EMAIL, password: PASSWORD })
  })

  test('sign out clears the session and re-protects /dashboard', async ({
    page
  }) => {
    await signIn(page, EMAIL, PASSWORD)
    await page.getByRole('button', { name: /sign out/i }).click()
    await page.waitForURL((url) => url.pathname !== '/dashboard')

    await page.goto('/dashboard')
    await page.waitForURL(/\/sign-in\?callbackUrl=/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/sign-in')
    expect(
      decodeURIComponent(url.searchParams.get('callbackUrl') ?? '')
    ).toContain('/dashboard')
  })
})
