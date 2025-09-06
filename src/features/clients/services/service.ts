'use server'

import { cookies } from 'next/headers'

import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken, handleClientApiError } from '@/lib/service-utils'

import type { Client } from '../types'

interface CreateClientPayload {
  data: {
    name: string
    email: string
    phone?: string
    cpf_or_cnpj?: string
    enterprise?: string
    address?: string
  }
}

export async function createClient(payload: CreateClientPayload) {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.post('/api/clients', payload, {
      headers: createAuthHeaders(jwt),
    })

    return response.data
  } catch (error) {
    handleClientApiError(error, 'createClient')
  }
}

export async function getClients(): Promise<Client[]> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    return []
  }

  const response = await axiosInstance
    .get('/api/clients', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Cache-Control': 'no-store',
      },
    })
    .catch(() => ({ data: { data: [] } }))

  return response.data.data || []
}

export async function getClientByDocumentId(documentId: string): Promise<Client | null> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get(
      `/api/clients?filters[documentId][$eq]=${documentId}&populate=*`,
      {
        headers: createAuthHeaders(jwt),
      },
    )

    return response.data.data[0]
  } catch (error) {
    handleClientApiError(error, 'getClientByDocumentId')
  }
}

export async function updateClient(documentId: string, payload: CreateClientPayload) {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.put(`/api/clients/${documentId}`, payload, {
      headers: createAuthHeaders(jwt),
    })
    return response.data
  } catch (error) {
    handleClientApiError(error, 'updateClient')
  }
}

export async function deleteClient(documentId: string) {
  try {
    const jwt = await getJWTToken()
    await axiosInstance.delete(`/api/clients/${documentId}`, {
      headers: createAuthHeaders(jwt),
    })
  } catch (error) {
    handleClientApiError(error, 'deleteClient')
  }
}
