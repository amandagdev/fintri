'use server'

import type { AxiosError } from 'axios'
import { cookies } from 'next/headers'

import { axiosInstance } from '@/lib/axios'
import { mapQuoteErrorToKey } from '@/utils/strapi-error-map'

import type { Quote } from '../state'

interface CreateQuotePayload {
  data: {
    title: string
    description?: string
    status_quote?: string
    quote_send_date?: string
    quote_validate_date?: string
    observations?: string
    client?: {
      id: string
      name: string
    }
    total_value: number
    discount?: number
    notification?: {
      id: string
    }
  }
}

export async function getQuotes(): Promise<Quote[]> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  const headers: Record<string, string> = {
    'Cache-Control': 'no-store',
  }

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  try {
    const response = await axiosInstance.get('/api/quotes?populate=*', {
      headers,
    })

    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return []
  }
}

export async function getQuoteByDocumentId(documentId: string): Promise<Quote | null> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  const headers: Record<string, string> = {}

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  try {
    const response = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}&populate=*`,
      {
        headers,
      },
    )

    return response.data.data[0]
  } catch (error) {
    console.error('Erro ao buscar orçamento por documentId:', error)
    throw new Error('errors.quoteFetchFailed')
  }
}

export async function addQuote(payload: CreateQuotePayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) throw new Error('errors.unauthenticated')

  const strapiPayload = {
    data: {
      ...payload.data,
      client: payload.data.client?.id ? payload.data.client.id : undefined,
      notification: payload.data.notification?.id ? payload.data.notification.id : undefined,
    },
  }

  try {
    const response = await axiosInstance.post('/api/quotes', strapiPayload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message

    console.error('Erro detalhado ao atualizar orçamento:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      strapiMessage,
    })
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}

export async function updateQuote(documentId: string, payload: CreateQuotePayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  const headers: Record<string, string> = {}

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  const strapiPayload = {
    data: {
      ...payload.data,
      client: payload.data.client?.id ? payload.data.client.id : undefined,
      notification: payload.data.notification?.id ? payload.data.notification.id : undefined,
    },
  }

  try {
    const response = await axiosInstance.put(`/api/quotes/${documentId}`, strapiPayload, {
      headers,
    })
    return response.data.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}

export async function deleteQuote(documentId: string) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  console.log('Tentando excluir orçamento com documentId:', documentId)

  const headers: Record<string, string> = {}

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  try {
    const response = await axiosInstance.delete(`/api/quotes/${documentId}`, {
      headers,
    })
    console.log('Resposta da exclusão:', response.status)
    return response.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message
    console.error('Erro ao excluir orçamento:', error.response?.status, strapiMessage)
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}
