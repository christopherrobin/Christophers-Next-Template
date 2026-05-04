import { expect, test } from '@playwright/test'

import { getUserByEmail, seedUser } from '../helpers/db'

const DUPLICATE_EMAIL = 'dup-api@test.dev'

test.describe('POST /api/join', () => {
  test.beforeAll(async () => {
    await seedUser({ email: DUPLICATE_EMAIL, password: 'AlreadyHere42!' })
  })

  test('creates a new user with valid credentials', async ({
    request
  }, testInfo) => {
    const email = `api-${testInfo.workerIndex}-${Date.now()}@test.dev`
    const res = await request.post('/api/join', {
      data: { email, password: 'Strong42!' }
    })
    expect(res.status()).toBe(200)
    expect(await res.json()).toEqual({ ok: true })

    const dbUser = await getUserByEmail(email)
    expect(dbUser?.email).toBe(email)
  })

  test('returns 400 with field details when email is missing', async ({
    request
  }) => {
    const res = await request.post('/api/join', {
      data: { password: 'Strong42!' }
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid input')
    expect(body.details.email).toBeTruthy()
  })

  test('returns 400 with field details when password is missing', async ({
    request
  }) => {
    const res = await request.post('/api/join', {
      data: { email: 'pwless@test.dev' }
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid input')
    expect(body.details.password).toBeTruthy()
  })

  test('returns 400 with field details when password is too short', async ({
    request
  }) => {
    const res = await request.post('/api/join', {
      data: { email: 'short@test.dev', password: 'pw' }
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid input')
    expect(body.details.password).toEqual(
      expect.arrayContaining([expect.stringMatching(/at least 8/i)])
    )
  })

  test('returns 400 for a duplicate email', async ({ request }) => {
    const res = await request.post('/api/join', {
      data: { email: DUPLICATE_EMAIL, password: 'WhatEver42!' }
    })
    expect(res.status()).toBe(400)
    expect(await res.json()).toEqual({ error: 'User already exists' })
  })

  test('returns 500 when the body is not valid JSON', async ({ request }) => {
    const res = await request.post('/api/join', {
      data: Buffer.from('not-json'),
      headers: { 'content-type': 'application/json' }
    })
    expect(res.status()).toBe(500)
  })
})
