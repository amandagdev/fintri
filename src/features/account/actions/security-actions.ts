'use server'

import { updatePassword } from '../services/security-service'
import type { UpdatePasswordPayload, UserState } from '../types'
import { PasswordSchema } from '../validation/schemas'

export async function updatePasswordAction(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const currentPassword = formData.get('currentPassword')
  const password = formData.get('password')
  const passwordConfirmation = formData.get('passwordConfirmation')

  const data: UpdatePasswordPayload = {
    currentPassword: currentPassword && typeof currentPassword === 'string' ? currentPassword : '',
    password: password && typeof password === 'string' ? password : '',
    passwordConfirmation:
      passwordConfirmation && typeof passwordConfirmation === 'string' ? passwordConfirmation : '',
  }

  const parsed = PasswordSchema.safeParse(data)

  if (!parsed.success) {
    return {
      message: 'validationFailed',
      errors: parsed.error.flatten().fieldErrors as UserState['errors'],
    }
  }

  try {
    await updatePassword(parsed.data)
    return { message: 'success.passwordUpdated' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'default'
    return { message: errorMessage }
  }
}
