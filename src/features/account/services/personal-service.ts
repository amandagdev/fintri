import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken, handleApiError } from '@/lib/service-utils'

import type { UpdatePersonalDataPayload, User } from '../types'

export async function getCurrentUser(): Promise<User> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get('/api/users/me', {
      headers: createAuthHeaders(jwt),
    })

    return mapUserData(response.data)
  } catch (error) {
    handleApiError(error, 'getCurrentUser', 'account.errors')
  }
}

export async function updatePersonalData(payload: UpdatePersonalDataPayload): Promise<User> {
  try {
    const jwt = await getJWTToken()

    const meResponse = await axiosInstance.get('/api/users/me', {
      headers: createAuthHeaders(jwt),
    })
    const userId = meResponse.data?.id

    if (!userId) {
      throw new Error('account.errors.notFound')
    }

    const strapiPayload: Record<string, unknown> = {}
    if (payload.fullName !== undefined) strapiPayload.username = payload.fullName
    if (payload.phone !== undefined) {
      strapiPayload.phone = payload.phone
      strapiPayload.telephone = payload.phone
    }
    if (payload.cpf !== undefined) {
      strapiPayload.cpf = payload.cpf
      strapiPayload.document = payload.cpf
    }

    const response = await axiosInstance.put(`/api/users/${userId}`, strapiPayload, {
      headers: createAuthHeaders(jwt),
    })

    return mapUserData(response.data)
  } catch (error) {
    handleApiError(error, 'updatePersonalData', 'account.errors')
  }
}

function mapUserData(userData: Record<string, unknown>): User {
  return {
    username: (userData.username as string) || '',
    email: (userData.email as string) || '',
    phone: (userData.phone as string) || (userData.telephone as string) || '',
    cpf: (userData.cpf as string) || (userData.document as string) || '',
  }
}
