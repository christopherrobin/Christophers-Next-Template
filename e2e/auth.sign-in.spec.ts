import { expect, test } from '@playwright/test'

import { seedUser } from './helpers/db'

const TEST_EMAIL = 'signin@test.dev'
const TEST_PASSWORD = 'ChrisIsTheBest42!'

test.describe('sign-in flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
  })

  test('happy path lands on /dashboard with welcome message', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
    await expect(
      page.getByRole('heading', { name: `Welcome, ${TEST_EMAIL}` })
    ).toBeVisible()
  })

  test('wrong password shows Invalid email or password and stays on /sign-in', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/password/i).fill('WrongPassword!')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('unknown user shows Invalid email or password', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill('ghost@nowhere.dev')
    await page.getByLabel(/password/i).fill('Whatever123!')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('empty fields show zod errors and skip network call', async ({
    page
  }) => {
    await page.goto('/sign-in')
    let calledNextAuth = false
    page.on('request', (req) => {
      if (req.url().includes('/api/auth/callback/credentials')) {
        calledNextAuth = true
      }
    })
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/\/sign-in$/)
    await expect(page.getByTestId('sign-in-email-error')).toContainText(
      /email is required/i
    )
    await expect(page.getByTestId('sign-in-password-error')).toContainText(
      /password is required/i
    )
    expect(calledNextAuth).toBe(false)
  })

  test('Sign up link navigates to /sign-up', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('link', { name: 'Sign up' }).click()
    await page.waitForURL('**/sign-up')
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible()
  })
})
