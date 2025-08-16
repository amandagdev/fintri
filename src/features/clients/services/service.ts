import type { AxiosError } from 'axios'
import { cookies } from 'next/headers'

import { axiosInstance } from '@/lib/axios'
import { mapClientErrorToKey } from '@/utils/strapi-error-map'

import type { Client } from '../types'

interface CreateClientPayload {
  data: {
    name: string
    email: string
    phone?: string
    taxId?: string
    address?: string
  }
}

export async function createClient(payload: CreateClientPayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    throw new Error('errors.unauthenticated')
  }

  try {
    const response = await axiosInstance.post('/api/clients', payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return response.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message

    const errorKey = mapClientErrorToKey(strapiMessage)

    throw new Error(errorKey)
  }
}

export async function getClients(): Promise<Client[]> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) return []

  try {
    const response = await axiosInstance.get('/api/clients?sort=name:asc&populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Cache-Control': 'no-store',
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return []
  }
}

export async function deleteClient(documentId: string) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) throw new Error('clients.errors.unauthenticated')

  try {
    await axiosInstance.delete(`/api/clients/${documentId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    throw new Error('clients.errors.deleteFailed')
  }
}
