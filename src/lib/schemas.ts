import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
})

export type SignInInput = z.infer<typeof signInSchema>

export const joinSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type JoinInput = z.infer<typeof joinSchema>
