'use server'

import { cookies } from 'next/headers'

import type { LoginState } from './state'
import type { LoginFormData } from './types'
import { authService } from '../services/auth-service'

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const data: LoginFormData = {
    identifier: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
  }

  if (!data.identifier || !data.password) {
    return { errors: {}, message: 'errors.invalidCredentials' }
  }

  try {
    const authData = await authService.login(data)

    const cookieStore = await cookies()
    cookieStore.set('jwt', authData.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })
    cookieStore.set('user', JSON.stringify(authData.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return { errors: {}, message: '', success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'errors.default'
    return { errors: {}, message: errorMessage }
  }
}
