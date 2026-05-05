/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env }

const baseEnv = {
  DATABASE_PUBLIC_URL: 'postgresql://u:p@localhost:5432/db',
  NEXTAUTH_SECRET: 'test-secret-must-be-at-least-32-characters-long-yes',
  NODE_ENV: 'development'
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  jest.resetModules()
})

describe('env validator', () => {
  it('accepts a minimal valid env', () => {
    process.env = { ...baseEnv } as NodeJS.ProcessEnv
    expect(() => require('./env')).not.toThrow()
  })

  it('throws when DATABASE_PUBLIC_URL is missing', () => {
    process.env = {
      ...baseEnv,
      DATABASE_PUBLIC_URL: undefined
    } as unknown as NodeJS.ProcessEnv
    expect(() => require('./env')).toThrow(/Invalid environment variables/)
  })

  it('throws when NEXTAUTH_SECRET is too short', () => {
    process.env = {
      ...baseEnv,
      NEXTAUTH_SECRET: 'too-short'
    } as NodeJS.ProcessEnv
    expect(() => require('./env')).toThrow(/Invalid environment variables/)
  })

  it('requires NEXTAUTH_URL in production', () => {
    process.env = {
      ...baseEnv,
      NODE_ENV: 'production'
    } as unknown as NodeJS.ProcessEnv
    expect(() => require('./env')).toThrow(/Invalid environment variables/)
  })

  it('does not require NEXTAUTH_URL in development', () => {
    process.env = { ...baseEnv } as NodeJS.ProcessEnv
    expect(() => require('./env')).not.toThrow()
  })
})
