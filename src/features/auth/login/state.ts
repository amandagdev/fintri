import type { LoginFormData } from './types'

export type LoginState = {
  errors: Partial<Record<keyof LoginFormData, string>>
  message?: string
  success?: boolean
}

export const initialLoginState: LoginState = {
  errors: {},
  message: '',
  success: false,
}
