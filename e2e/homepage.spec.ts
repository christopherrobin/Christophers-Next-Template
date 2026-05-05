import { expect, test } from '@playwright/test'

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has expected title', async ({ page }) => {
    await expect(page).toHaveTitle('Christophers-Next-Template')
  })

  test('Sign Up button links to /sign-up', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: 'Sign Up' })
    await expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })

  test('Sign In button links to /sign-in', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: 'Sign In' })
    await expect(signInLink).toHaveAttribute('href', '/sign-in')
  })

  test('GitHub link is present and external', async ({ page }) => {
    const githubLink = page.getByRole('link', { name: '@christopherrobin' })
    const href = await githubLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^https?:\/\//)
  })
})
