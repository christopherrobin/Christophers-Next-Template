import { expect, test } from '@playwright/test'

test.describe('404 page', () => {
  test('unknown route returns 404 and renders the not-found page', async ({
    page
  }) => {
    const response = await page.goto('/this-route-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible()
  })

  test('Go Home link returns the user to /', async ({ page }) => {
    await page.goto('/this-route-also-does-not-exist')
    await page.getByRole('link', { name: /go home/i }).click()
    await page.waitForURL(/\/$/)
    await expect(page.getByRole('heading', { name: /howdy/i })).toBeVisible()
  })
})
