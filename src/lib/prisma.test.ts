/**
 * @jest-environment node
 */
const constructorSpy = jest.fn()

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(function (
    this: { tag: string },
    ...args: unknown[]
  ) {
    constructorSpy(...args)
    this.tag = 'instance'
  })
}))

describe('prisma singleton', () => {
  const originalEnv = process.env.NODE_ENV
  const globalForPrisma = globalThis as unknown as { prisma?: unknown }

  beforeEach(() => {
    constructorSpy.mockClear()
    delete globalForPrisma.prisma
  })

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      configurable: true
    })
    delete globalForPrisma.prisma
  })

  it('caches the prisma instance on globalThis in development', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true
    })

    let firstClient: unknown
    let secondClient: unknown
    jest.isolateModules(() => {
      firstClient = require('./prisma').prisma
    })
    jest.isolateModules(() => {
      secondClient = require('./prisma').prisma
    })

    expect(constructorSpy).toHaveBeenCalledTimes(1)
    expect(firstClient).toBe(secondClient)
    expect(globalForPrisma.prisma).toBe(firstClient)
  })

  it('does not attach to globalThis in production', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      configurable: true
    })

    jest.isolateModules(() => {
      require('./prisma')
    })

    expect(constructorSpy).toHaveBeenCalledTimes(1)
    expect(globalForPrisma.prisma).toBeUndefined()
  })
})
