import { expect, type Page } from '@playwright/test'

export async function signIn(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/sign-in')
  await page.getByPlaceholder('Email').fill(email)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('**/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
}
