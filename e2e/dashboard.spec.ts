import { expect, test } from './fixtures'

test.describe('dashboard (authenticated)', () => {
  test('renders the heading and welcome line for the seeded user', async ({
    authedPage,
    authedEmail
  }) => {
    await authedPage.goto('/dashboard')
    await expect(
      authedPage.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible()
    await expect(
      authedPage.getByRole('heading', { name: `Welcome, ${authedEmail}` })
    ).toBeVisible()
  })

  test('renders the JSON-stringified session containing the user email', async ({
    authedPage,
    authedEmail
  }) => {
    await authedPage.goto('/dashboard')
    await expect(authedPage.getByTestId('session-json')).toContainText(
      authedEmail
    )
  })

  test('exposes a Sign out button', async ({ authedPage }) => {
    await authedPage.goto('/dashboard')
    await expect(
      authedPage.getByRole('button', { name: /sign out/i })
    ).toBeVisible()
  })
})
