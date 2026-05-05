import { expect, test } from '@playwright/test'

import { getUserByEmail, seedUser } from './helpers/db'

const EXISTING_EMAIL = 'existing@test.dev'
const EXISTING_PASSWORD = 'AlreadyHere42!'

test.describe('sign-up flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: EXISTING_EMAIL, password: EXISTING_PASSWORD })
  })

  test('happy path creates user, lands on /dashboard, persists in DB', async ({
    page
  }, testInfo) => {
    const newEmail = `new-${testInfo.workerIndex}-${Date.now()}@test.dev`
    const password = 'BrandNew42!'

    await page.goto('/sign-up')
    await page.getByPlaceholder('Email').fill(newEmail)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: /^Sign Up/ }).click()
    await page.waitForURL('**/dashboard')
    await expect(
      page.getByRole('heading', { name: `Welcome, ${newEmail}` })
    ).toBeVisible()

    const dbUser = await getUserByEmail(newEmail)
    expect(dbUser).not.toBeNull()
    expect(dbUser?.email).toBe(newEmail)
  })

  test('existing email shows User already exists, stays on /sign-up', async ({
    page
  }) => {
    await page.goto('/sign-up')
    await page.getByPlaceholder('Email').fill(EXISTING_EMAIL)
    await page.getByPlaceholder('Password').fill('AnyPassword42!')
    await page.getByRole('button', { name: /^Sign Up/ }).click()
    await expect(page.getByText('User already exists')).toBeVisible()
    await expect(page).toHaveURL(/\/sign-up$/)
  })

  test('empty submit shows zod errors and skips network', async ({ page }) => {
    await page.goto('/sign-up')
    let calledSignUpApi = false
    page.on('request', (req) => {
      if (req.url().includes('/api/sign-up')) calledSignUpApi = true
    })
    await page.getByRole('button', { name: /^Sign Up/ }).click()
    await expect(page).toHaveURL(/\/sign-up$/)
    await expect(page.getByTestId('sign-up-email-error')).toContainText(
      /email is required/i
    )
    await expect(page.getByTestId('sign-up-password-error')).toContainText(
      /at least 8/i
    )
    expect(calledSignUpApi).toBe(false)
  })

  test('Sign In link navigates to /sign-in', async ({ page }) => {
    await page.goto('/sign-up')
    await page.getByRole('link', { name: 'Sign In' }).click()
    await page.waitForURL('**/sign-in')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })
})
