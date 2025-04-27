import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }
    const hashed = await hash(password, 10)
    await prisma.user.create({ data: { email, password: hashed } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Registration error:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
