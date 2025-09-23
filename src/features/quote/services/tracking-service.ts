'use server'

import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken } from '@/lib/service-utils'

export interface TrackingEvent {
  id: number
  event_type: 'viewed' | 'downloaded'
  timestamp: string
  user_agent: string
  ip_address: string
  session_id: string
  referrer?: string
  quote?: {
    documentId: string
  }
}

export interface QuoteTrackingStats {
  quoteId: string
  totalViews: number
  totalDownloads: number
  uniqueSessions: number
  lastViewed?: string
  lastDownloaded?: string
  events: TrackingEvent[]
}

export async function getQuoteTrackingStats(quoteId: string): Promise<QuoteTrackingStats> {
  try {
    const jwt = await getJWTToken()

    const response = await axiosInstance.get(
      `/api/quote-trackings?filters[quote][documentId][$eq]=${quoteId}&populate=*&sort=timestamp:desc`,
      {
        headers: createAuthHeaders(jwt),
      },
    )

    const events: TrackingEvent[] = response.data.data || []

    const totalViews = events.filter((e) => e.event_type === 'viewed').length
    const totalDownloads = events.filter((e) => e.event_type === 'downloaded').length
    const uniqueSessions = new Set(events.map((e) => e.session_id)).size

    const lastViewed = events.find((e) => e.event_type === 'viewed')?.timestamp
    const lastDownloaded = events.find((e) => e.event_type === 'downloaded')?.timestamp

    return {
      quoteId,
      totalViews,
      totalDownloads,
      uniqueSessions,
      lastViewed,
      lastDownloaded,
      events,
    }
  } catch (error) {
    console.error('Error fetching quote tracking stats:', error)
    throw error
  }
}

export async function getAllQuotesTrackingStats(): Promise<QuoteTrackingStats[]> {
  try {
    const jwt = await getJWTToken()

    const trackingResponse = await axiosInstance.get(
      '/api/quote-trackings?populate=quote&sort=timestamp:desc',
      {
        headers: createAuthHeaders(jwt),
      },
    )

    const allEvents: TrackingEvent[] = trackingResponse.data.data || []
    const quotesResponse = await axiosInstance.get('/api/quotes?populate[0]=client', {
      headers: createAuthHeaders(jwt),
    })

    const quotes = quotesResponse.data.data || []

    const eventsByQuote = allEvents.reduce(
      (acc, event) => {
        const quoteId = event.quote?.documentId

        if (quoteId) {
          if (!acc[quoteId]) {
            acc[quoteId] = []
          }
          acc[quoteId].push(event)
        }

        return acc
      },
      {} as Record<string, TrackingEvent[]>,
    )

    return quotes.map((quote: { documentId: string }) => {
      const events: TrackingEvent[] = eventsByQuote[quote.documentId] || []

      const totalViews = events.filter((e) => e.event_type === 'viewed').length
      const totalDownloads = events.filter((e) => e.event_type === 'downloaded').length
      const uniqueSessions = new Set(events.map((e) => e.session_id)).size

      const lastViewed = events.find((e) => e.event_type === 'viewed')?.timestamp
      const lastDownloaded = events.find((e) => e.event_type === 'downloaded')?.timestamp

      return {
        quoteId: quote.documentId,
        totalViews,
        totalDownloads,
        uniqueSessions,
        lastViewed,
        lastDownloaded,
        events,
      }
    })
  } catch (error) {
    console.error('Error fetching all quotes tracking stats:', error)
    throw error
  }
}
