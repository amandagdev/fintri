import type { AxiosError } from 'axios'
import { cookies } from 'next/headers'

import { mapClientErrorToKey, mapQuoteErrorToKey } from '@/utils/strapi-error-map'

export async function getJWTToken(): Promise<string> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    throw new Error('clients.errors.unauthenticated')
  }

  return jwt
}

export function createAuthHeaders(jwt: string): Record<string, string> {
  return {
    Authorization: `Bearer ${jwt}`,
  }
}

export function handleClientApiError(error: unknown, _context: string): never {
  const axiosError = error as AxiosError<{ error: { message?: string } }>
  const strapiMessage = axiosError.response?.data?.error?.message

  if (axiosError.response?.status === 401) {
    throw new Error('clients.errors.unauthenticated')
  }

  const errorKey = mapClientErrorToKey(strapiMessage)
  throw new Error(errorKey)
}

export function handleQuoteApiError(error: unknown, _context: string): never {
  const axiosError = error as AxiosError<{ error: { message?: string } }>
  const strapiMessage = axiosError.response?.data?.error?.message

  if (axiosError.response?.status === 401) {
    throw new Error('quote.errors.unauthenticated')
  }

  const errorKey = mapQuoteErrorToKey(strapiMessage)
  throw new Error(errorKey)
}

export function handleApiError(
  error: unknown,
  _context: string,
  errorNamespace: string = 'errors',
): never {
  const axiosError = error as AxiosError<{ error: { message?: string } }>

  if (axiosError.response?.status === 401) {
    throw new Error(`${errorNamespace}.unauthenticated`)
  }

  throw new Error(`${errorNamespace}.default`)
}

export function formatDateForStrapi(dateString?: string): string | undefined {
  if (!dateString) return undefined

  try {
    if (dateString.includes('T') || dateString.includes('Z')) {
      return dateString
    }

    const date = new Date(dateString + 'T00:00:00.000Z')
    return date.toISOString()
  } catch {
    return undefined
  }
}
