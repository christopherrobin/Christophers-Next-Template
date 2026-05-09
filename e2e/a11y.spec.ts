import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { signIn } from './helpers/auth'
import { seedUser } from './helpers/db'

const TEST_EMAIL = 'a11y@test.dev'
const TEST_PASSWORD = 'ChrisIsTheBest42!'

// axe-core sweep on the public + authenticated surfaces. Catches WCAG
// 2.0/2.1 A + AA violations introduced by future UI changes.
//
// The home page enforces `color-contrast` in both schemes — that is the
// surface most likely to regress when adding new styling. Sign-in and
// dashboard keep `color-contrast` disabled because they include
// secondary text on muted backgrounds (`text-fg/60` etc.) that is
// intentionally low-contrast and gated by design review instead.
test.describe('accessibility (axe-core)', () => {
  test('home page (dark) has no detectable a11y violations', async ({
    page
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('home page (light) has no detectable a11y violations', async ({
    page
  }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('sign-in page has no detectable a11y violations', async ({ page }) => {
    await page.goto('/sign-in')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('dashboard (authenticated) has no detectable a11y violations', async ({
    page
  }) => {
    await seedUser({ email: TEST_EMAIL, password: TEST_PASSWORD })
    await signIn(page, TEST_EMAIL, TEST_PASSWORD)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze()
    expect(results.violations).toEqual([])
  })
})
