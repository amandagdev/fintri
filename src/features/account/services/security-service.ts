import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken, handleApiError } from '@/lib/service-utils'

import type { UpdatePasswordPayload } from '../types'

export async function updatePassword(payload: UpdatePasswordPayload): Promise<void> {
  try {
    const jwt = await getJWTToken()
    const strapiPayload = {
      currentPassword: payload.currentPassword,
      password: payload.password,
      passwordConfirmation: payload.passwordConfirmation,
    }

    await axiosInstance.post('/api/auth/change-password', strapiPayload, {
      headers: createAuthHeaders(jwt),
    })
  } catch (error) {
    handleApiError(error, 'updatePassword', 'account.errors')
  }
}
