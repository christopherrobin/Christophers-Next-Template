import { expect, test } from '@playwright/test'

import { seedUser } from './helpers/db'

const TEST_EMAIL = 'signin@test.dev'
const TEST_PASSWORD = 'CorrectHorse42!'

test.describe('sign-in flow', () => {
  test.beforeAll(async () => {
    await seedUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
  })

  test('happy path lands on /dashboard with welcome message', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByPlaceholder('Email').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('**/dashboard')
    await expect(
      page.getByRole('heading', { name: `Welcome, ${TEST_EMAIL}` })
    ).toBeVisible()
  })

  test('wrong password shows Invalid password and stays on /sign-in', async ({
    page
  }) => {
    await page.goto('/sign-in')
    await page.getByPlaceholder('Email').fill(TEST_EMAIL)
    await page.getByPlaceholder('Password').fill('WrongPassword!')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid password')).toBeVisible()
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('unknown user shows No user found', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByPlaceholder('Email').fill('ghost@nowhere.dev')
    await page.getByPlaceholder('Password').fill('Whatever123!')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('No user found')).toBeVisible()
    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('empty fields blocked by HTML5 required (no network call)', async ({
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
    const emailInput = page.getByPlaceholder('Email')
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    )
    expect(isInvalid).toBe(true)
    expect(calledNextAuth).toBe(false)
  })

  test('Join now link navigates to /join', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('link', { name: 'Join now' }).click()
    await page.waitForURL('**/join')
    await expect(
      page.getByRole('heading', { name: 'Join the Club' })
    ).toBeVisible()
  })
})
