import type { Config } from 'jest'
import nextJest from 'next/jest.js'

// Create the Next.js Jest configuration
const createJestConfig = nextJest({
  dir: './' // Path to your Next.js app
})

// Base Jest config
const customJestConfig: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@api/(.*)$': '<rootDir>/src/app/api/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test-utils/**',
    '!src/app/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/api/auth/**'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90
    }
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/']
}

// Export the merged configuration
export default createJestConfig(customJestConfig)
