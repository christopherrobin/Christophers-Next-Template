import type { Config } from 'jest'
import nextJest from 'next/jest'

// Create the Next.js Jest configuration
const createJestConfig = nextJest({
  dir: './' // Path to your Next.js app
})

// Base Jest config
const customJestConfig: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utilities/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/']
}

// Export the merged configuration
export default createJestConfig(customJestConfig)
