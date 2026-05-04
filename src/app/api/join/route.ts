import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { errorResponse } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return errorResponse('Missing email or password')
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse('User already exists')
    }
    const hashed = await hash(password, 10)
    await prisma.user.create({ data: { email, password: hashed } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Registration error:', e)
    return errorResponse('Internal server error', 500)
  }
}
