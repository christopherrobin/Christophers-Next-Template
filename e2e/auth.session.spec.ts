import { expect, test } from '@playwright/test'

import { signIn } from './helpers/auth'
import { seedUser } from './helpers/db'

const EMAIL = 'session@test.dev'
const PASSWORD = 'SessionPass42!'

test.describe('session lifecycle', () => {
  test.beforeAll(async () => {
    await seedUser({ email: EMAIL, password: PASSWORD })
  })

  test('sign out invalidates session for subsequent /dashboard visits', async ({
    page
  }) => {
    await signIn(page, EMAIL, PASSWORD)
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL((url) => url.pathname !== '/dashboard')
    await page.goto('/dashboard')
    await page.waitForURL(/\/sign-in\?callbackUrl=/)
    expect(new URL(page.url()).pathname).toBe('/sign-in')
  })

  test('session persists across reload', async ({ page }) => {
    await signIn(page, EMAIL, PASSWORD)
    await page.reload()
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(
      page.getByRole('heading', { name: `Welcome, ${EMAIL}` })
    ).toBeVisible()
  })

  test('callbackUrl preserved through sign-in flow', async ({ page }) => {
    await page.goto('/dashboard?foo=1')
    await page.waitForURL(/\/sign-in\?callbackUrl=/)

    await page.getByPlaceholder('Email').fill(EMAIL)
    await page.getByPlaceholder('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()

    await page.waitForURL(/\/dashboard\?foo=1/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/dashboard')
    expect(url.searchParams.get('foo')).toBe('1')
  })
})
