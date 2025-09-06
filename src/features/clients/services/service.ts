'use server'

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
    cpf_or_cnpj?: string
    enterprise?: string
    address?: string
  }
}

export async function createClient(payload: CreateClientPayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    throw new Error('errors.unauthenticated')
  }

  console.log('Payload sendo enviado:', JSON.stringify(payload, null, 2))
  console.log('JWT token:', jwt ? 'Presente' : 'Ausente')

  try {
    const response = await axiosInstance.post('/api/clients', payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    console.log('Resposta da API:', response.data)

    return response.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message

    console.error('Erro detalhado ao criar cliente:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      strapiMessage,
    })

    // Se for erro 401, redirecionar para login
    if (error.response?.status === 401) {
      throw new Error('errors.unauthenticated')
    }

    const errorKey = mapClientErrorToKey(strapiMessage)
    throw new Error(errorKey)
  }
}

export async function getClients(): Promise<Client[]> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    console.warn('No JWT token found for getClients request')
    return []
  }

  try {
    const response = await axiosInstance.get('/api/clients', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Cache-Control': 'no-store',
      },
    })

    return response.data.data || []
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return []
  }
}

export async function getClientByDocumentId(documentId: string): Promise<Client | null> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) throw new Error('errors.unauthenticated')

  try {
    const response = await axiosInstance.get(
      `/api/clients?filters[documentId][$eq]=${documentId}&populate=*`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    )

    return response.data.data[0]
  } catch (error) {
    console.error('Erro ao buscar cliente por documentId:', error)
    throw new Error('errors.clientFetchFailed')
  }
}

export async function updateClient(documentId: string, payload: CreateClientPayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  const headers: Record<string, string> = {}

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  console.log('Payload enviado para Strapi:', JSON.stringify(payload, null, 2))

  try {
    const response = await axiosInstance.put(`/api/clients/${documentId}`, payload, {
      headers,
    })
    return response.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message

    console.error('Erro detalhado ao atualizar cliente:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      strapiMessage,
    })

    throw new Error(mapClientErrorToKey(strapiMessage))
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
