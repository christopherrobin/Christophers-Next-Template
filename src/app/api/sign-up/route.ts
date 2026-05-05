import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { errorResponse, validationError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }
  try {
    const result = signUpSchema.safeParse(body)
    if (!result.success) {
      return validationError(result.error.flatten().fieldErrors)
    }
    const { email, password } = result.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse('User already exists')
    }
    const hashed = await hash(password, 12)
    await prisma.user.create({ data: { email, password: hashed } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Registration error:', e)
    return errorResponse('Internal server error', 500)
  }
}
