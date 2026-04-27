import { existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { test as base, type Page } from '@playwright/test'

import { signIn } from './helpers/auth'
import { seedUser } from './helpers/db'

interface Fixtures {
  authedPage: Page
  authedEmail: string
}

interface WorkerFixtures {
  authStorageStatePath: string
  authedUserEmail: string
}

const STORAGE_DIR = join(tmpdir(), 'cnt-playwright-auth')

if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true })
}

/* eslint-disable react-hooks/rules-of-hooks */
export const test = base.extend<Fixtures, WorkerFixtures>({
  authedUserEmail: [
    async ({}, use, workerInfo) => {
      const email = `worker-${workerInfo.workerIndex}-${Date.now()}@test.dev`
      await seedUser({ email, password: 'WorkerPass42!' })
      await use(email)
    },
    { scope: 'worker' }
  ],
  authStorageStatePath: [
    async ({ browser, authedUserEmail }, use, workerInfo) => {
      const path = join(
        STORAGE_DIR,
        `worker-${workerInfo.workerIndex}-state.json`
      )
      const context = await browser.newContext()
      const page = await context.newPage()
      await signIn(page, authedUserEmail, 'WorkerPass42!')
      await context.storageState({ path })
      await context.close()
      await use(path)
    },
    { scope: 'worker' }
  ],
  authedEmail: async ({ authedUserEmail }, use) => {
    await use(authedUserEmail)
  },
  authedPage: async ({ browser, authStorageStatePath }, use) => {
    const context = await browser.newContext({
      storageState: authStorageStatePath
    })
    const page = await context.newPage()
    await use(page)
    await context.close()
  }
})
/* eslint-enable react-hooks/rules-of-hooks */

export { expect } from '@playwright/test'
