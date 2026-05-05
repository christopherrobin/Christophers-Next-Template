import { expect, test } from './fixtures'

test.describe('middleware (anonymous)', () => {
  test('/dashboard redirects to /sign-in with callbackUrl', async ({
    page
  }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/sign-in\?callbackUrl=/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/sign-in')
    const callback = url.searchParams.get('callbackUrl')
    expect(callback).toBeTruthy()
    expect(decodeURIComponent(callback!)).toContain('/dashboard')
  })

  test('/dashboard/anything (nested) redirects to /sign-in with callbackUrl', async ({
    page
  }) => {
    await page.goto('/dashboard/anything')
    await page.waitForURL(/\/sign-in\?callbackUrl=/)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/sign-in')
    const callback = url.searchParams.get('callbackUrl')
    expect(callback).toBeTruthy()
    expect(decodeURIComponent(callback!)).toContain('/dashboard/anything')
  })

  test('/sign-in stays accessible', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page).toHaveURL(/\/sign-in$/)
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
  })

  test('/sign-up stays accessible', async ({ page }) => {
    await page.goto('/sign-up')
    await expect(page).toHaveURL(/\/sign-up$/)
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
  })

  test('/ stays accessible (public for everyone)', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { name: 'Howdy.' })).toBeVisible()
  })
})

test.describe('middleware (authenticated)', () => {
  test('/sign-in redirects to /dashboard', async ({ authedPage }) => {
    await authedPage.goto('/sign-in')
    await authedPage.waitForURL('**/dashboard')
    expect(new URL(authedPage.url()).pathname).toBe('/dashboard')
  })

  test('/sign-up redirects to /dashboard', async ({ authedPage }) => {
    await authedPage.goto('/sign-up')
    await authedPage.waitForURL('**/dashboard')
    expect(new URL(authedPage.url()).pathname).toBe('/dashboard')
  })

  test('/ stays accessible', async ({ authedPage }) => {
    await authedPage.goto('/')
    await expect(authedPage).toHaveURL(/\/$/)
    await expect(
      authedPage.getByRole('heading', { name: 'Howdy.' })
    ).toBeVisible()
  })

  test('/dashboard stays accessible', async ({ authedPage }) => {
    await authedPage.goto('/dashboard')
    await expect(authedPage).toHaveURL(/\/dashboard$/)
    await expect(
      authedPage.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible()
  })
})
