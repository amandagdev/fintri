'use server'

import { cookies } from 'next/headers'

import type { RegisterFormData } from './types'
import { authService } from '../services/auth-service'
import { registerSchema } from './validation/schema'

export type State = {
  errors: Partial<Record<keyof RegisterFormData, string>>
  message?: string
  success?: boolean
}

export async function registerUser(prevState: State, formData: FormData): Promise<State> {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    const fieldErrors: State['errors'] = {}
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof RegisterFormData
      fieldErrors[field] = issue.message
    })
    return { errors: fieldErrors }
  }

  try {
    const authData = await authService.register(parsed.data)

    const cookieStore = await cookies()

    cookieStore.set('jwt', authData.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    cookieStore.set('user', JSON.stringify(authData.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { errors: {}, success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'errors.registerError'
    return { errors: {}, message: errorMessage }
  }
}
