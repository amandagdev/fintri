'use server'

import { axiosInstance } from '@/lib/axios'
import {
  createAuthHeaders,
  formatDateForStrapi,
  getJWTToken,
  handleQuoteApiError,
} from '@/lib/service-utils'

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
    quote_type?: 'simple' | 'detailed'
    items?: Array<{
      item_type: 'service' | 'product'
      item_name: string
      quantity: number
      unit_price: number
    }>
  }
}

export async function getQuotes(): Promise<Quote[]> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get('/api/quotes?populate=*', {
      headers: {
        ...createAuthHeaders(jwt),
        'Cache-Control': 'no-store',
      },
    })

    return response.data.data
  } catch {
    return []
  }
}

export async function getQuoteByDocumentId(documentId: string): Promise<Quote | null> {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}&populate=*`,
      {
        headers: createAuthHeaders(jwt),
      },
    )

    const quote = response.data.data[0]
    if (!quote) return null

    return {
      ...quote,
      items: quote.QuoteItem || [],
    }
  } catch (error) {
    handleQuoteApiError(error, 'getQuoteByDocumentId')
  }
}

export async function addQuote(payload: CreateQuotePayload) {
  try {
    const jwt = await getJWTToken()
    const strapiPayload = {
      data: {
        title: payload.data.title,
        description: payload.data.description,
        status_quote: payload.data.status_quote,
        quote_send_date: formatDateForStrapi(payload.data.quote_send_date),
        quote_validate_date: formatDateForStrapi(payload.data.quote_validate_date),
        observations: payload.data.observations,
        client: payload.data.client?.id ? payload.data.client.id : undefined,
        total_value: payload.data.total_value,
        discount: payload.data.discount,
        notification: payload.data.notification?.id ? payload.data.notification.id : undefined,
        QuoteItem:
          payload.data.items?.map((item) => ({
            item_type: item.item_type,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })) || [],
      },
    }

    const response = await axiosInstance.post('/api/quotes', strapiPayload, {
      headers: createAuthHeaders(jwt),
    })
    return response.data.data
  } catch (error) {
    handleQuoteApiError(error, 'addQuote')
  }
}

export async function updateQuote(documentId: string, payload: CreateQuotePayload) {
  try {
    const jwt = await getJWTToken()
    const strapiPayload = {
      data: {
        title: payload.data.title,
        description: payload.data.description,
        status_quote: payload.data.status_quote,
        quote_send_date: formatDateForStrapi(payload.data.quote_send_date),
        quote_validate_date: formatDateForStrapi(payload.data.quote_validate_date),
        observations: payload.data.observations,
        client: payload.data.client?.id ? payload.data.client.id : undefined,
        total_value: payload.data.total_value,
        discount: payload.data.discount,
        notification: payload.data.notification?.id ? payload.data.notification.id : undefined,
        QuoteItem:
          payload.data.items?.map((item) => ({
            item_type: item.item_type,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })) || [],
      },
    }

    const response = await axiosInstance.put(`/api/quotes/${documentId}`, strapiPayload, {
      headers: createAuthHeaders(jwt),
    })
    return response.data.data
  } catch (error) {
    handleQuoteApiError(error, 'updateQuote')
  }
}

export async function deleteQuote(documentId: string) {
  try {
    const jwt = await getJWTToken()
    const response = await axiosInstance.delete(`/api/quotes/${documentId}`, {
      headers: createAuthHeaders(jwt),
    })
    return response.data
  } catch (error) {
    handleQuoteApiError(error, 'deleteQuote')
  }
}
