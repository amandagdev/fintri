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
    notification?: {
      id: string
    }
  }
}

export async function getQuotes(): Promise<Quote[]> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) return []

  try {
    const response = await axiosInstance.get('/api/quotes', {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Cache-Control': 'no-store',
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
    return []
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) throw new Error('errors.unauthenticated')

  try {
    const response = await axiosInstance.get(`/api/quotes/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar orçamento por ID:', error)
    throw new Error('errors.quoteFetchFailed')
  }
}

export async function addQuote(payload: CreateQuotePayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) throw new Error('errors.unauthenticated')
  try {
    const response = await axiosInstance.post('/api/quotes', payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}

export async function updateQuote(id: string, payload: CreateQuotePayload) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) throw new Error('errors.unauthenticated')

  try {
    const response = await axiosInstance.put(`/api/quotes/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}

export async function deleteQuote(id: string) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) throw new Error('errors.unauthenticated')

  try {
    await axiosInstance.delete(`/api/quotes/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  } catch (err) {
    const error = err as AxiosError<{ error: { message?: string } }>
    const strapiMessage = error.response?.data?.error?.message
    throw new Error(mapQuoteErrorToKey(strapiMessage))
  }
}
