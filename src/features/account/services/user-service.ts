import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken, handleApiError } from '@/lib/service-utils'

import type {
  Company,
  UpdateCompanyDataPayload,
  UpdatePasswordPayload,
  UpdatePersonalDataPayload,
  User,
} from '../types'

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

export async function getCompanyData(): Promise<Company> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get('/api/company?populate=*', {
      headers: createAuthHeaders(jwt),
    })

    const companyData = response.data.data || response.data
    const mappedCompany = mapCompanyData(companyData)

    return mappedCompany
  } catch {
    return getEmptyCompany()
  }
}

export async function updatePersonalData(payload: UpdatePersonalDataPayload): Promise<User> {
  try {
    const jwt = await getJWTToken()

    let response
    try {
      response = await axiosInstance.put('/api/users/me', payload, {
        headers: createAuthHeaders(jwt),
      })
    } catch {
      const userData = await axiosInstance.get('/api/users/me', {
        headers: createAuthHeaders(jwt),
      })
      response = await axiosInstance.put(`/api/users/${userData.data.id}`, payload, {
        headers: createAuthHeaders(jwt),
      })
    }

    return mapUserData(response.data)
  } catch (error) {
    handleApiError(error, 'updatePersonalData', 'account.errors')
  }
}

export async function updateCompanyData(payload: UpdateCompanyDataPayload): Promise<void> {
  try {
    const jwt = await getJWTToken()

    await axiosInstance.put(
      '/api/company',
      { data: payload.company },
      {
        headers: createAuthHeaders(jwt),
      },
    )
  } catch (error) {
    handleApiError(error, 'updateCompanyData', 'account.errors')
  }
}

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

function mapUserData(userData: Record<string, unknown>): User {
  return {
    username: (userData.username as string) || '',
    email: (userData.email as string) || '',
    phone: (userData.phone as string) || (userData.telephone as string) || '',
    cpf: (userData.cpf as string) || (userData.document as string) || '',
  }
}

function mapCompanyData(companyData: Record<string, unknown> | null): Company {
  if (!companyData) {
    return getEmptyCompany()
  }

  const logoUrl = (companyData.logo as Record<string, unknown>)?.url as string
  const fullLogoUrl = logoUrl
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${logoUrl}`
    : ''

  return {
    name: (companyData.name as string) || '',
    cnpj: (companyData.cnpj as string) || '',
    address: (companyData.address as string) || '',
    email: (companyData.email as string) || '',
    phone: (companyData.phone as string) || '',
    logo: fullLogoUrl,
  }
}

function getEmptyCompany(): Company {
  return {
    name: '',
    cnpj: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
  }
}
