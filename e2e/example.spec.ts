import { test, expect } from '@playwright/test'

test('homepage has expected title', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle('Christophers-Next-Template')
})
