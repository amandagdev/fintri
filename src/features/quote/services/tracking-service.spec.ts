import type { AxiosError } from 'axios'

import { axiosInstance } from '@/lib/axios'
import { createAuthHeaders, getJWTToken } from '@/lib/service-utils'

import { getAllQuotesTrackingStats, getQuoteTrackingStats } from './tracking-service'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}))

jest.mock('@/lib/service-utils', () => ({
  createAuthHeaders: jest.fn(),
  getJWTToken: jest.fn(),
}))

describe('Tracking Service', () => {
  const mockJwt = 'mock-jwt-token'
  const mockAuthHeaders = { Authorization: `Bearer ${mockJwt}` }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getJWTToken as jest.Mock).mockResolvedValue(mockJwt)
    ;(createAuthHeaders as jest.Mock).mockReturnValue(mockAuthHeaders)
  })

  describe('getQuoteTrackingStats', () => {
    const quoteId = 'quote-123'

    it('successfully fetches tracking stats for a specific quote', async () => {
      const mockEvents = [
        {
          id: 1,
          event_type: 'viewed',
          timestamp: '2024-01-15T10:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: 'https://example.com',
          quote: { documentId: quoteId },
        },
        {
          id: 2,
          event_type: 'downloaded',
          timestamp: '2024-01-15T11:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: null,
          quote: { documentId: quoteId },
        },
      ]

      ;(axiosInstance.get as jest.Mock).mockResolvedValue({
        data: { data: mockEvents },
      })

      const result = await getQuoteTrackingStats(quoteId)

      expect(getJWTToken).toHaveBeenCalled()
      expect(createAuthHeaders).toHaveBeenCalledWith(mockJwt)
      expect(axiosInstance.get).toHaveBeenCalledWith(
        `/api/quote-trackings?filters[quote][documentId][$eq]=${quoteId}&populate=*&sort=timestamp:desc`,
        { headers: mockAuthHeaders },
      )

      expect(result).toEqual({
        quoteId,
        totalViews: 1,
        totalDownloads: 1,
        uniqueSessions: 1,
        lastViewed: '2024-01-15T10:00:00.000Z',
        lastDownloaded: '2024-01-15T11:00:00.000Z',
        events: mockEvents,
      })
    })

    it('returns zero stats when no events found', async () => {
      ;(axiosInstance.get as jest.Mock).mockResolvedValue({
        data: { data: [] },
      })

      const result = await getQuoteTrackingStats(quoteId)

      expect(result).toEqual({
        quoteId,
        totalViews: 0,
        totalDownloads: 0,
        uniqueSessions: 0,
        events: [],
      })
    })

    it('handles errors when fetching tracking stats', async () => {
      const error = new Error('API Error') as AxiosError
      ;(axiosInstance.get as jest.Mock).mockRejectedValue(error)

      await expect(getQuoteTrackingStats(quoteId)).rejects.toThrow('API Error')
    })
  })

  describe('getAllQuotesTrackingStats', () => {
    it('successfully fetches tracking stats for all quotes', async () => {
      const mockTrackingEvents = [
        {
          id: 1,
          event_type: 'viewed',
          timestamp: '2024-01-15T10:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: 'https://example.com',
          quote: { documentId: 'quote-123' },
        },
        {
          id: 2,
          event_type: 'downloaded',
          timestamp: '2024-01-15T11:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: null,
          quote: { documentId: 'quote-123' },
        },
        {
          id: 3,
          event_type: 'viewed',
          timestamp: '2024-01-15T12:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.2',
          session_id: 'session-2',
          referrer: 'https://google.com',
          quote: { documentId: 'quote-456' },
        },
      ]

      const mockQuotes = [
        { documentId: 'quote-123' },
        { documentId: 'quote-456' },
        { documentId: 'quote-789' },
      ]

      ;(axiosInstance.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { data: mockTrackingEvents },
        })
        .mockResolvedValueOnce({
          data: { data: mockQuotes },
        })

      const result = await getAllQuotesTrackingStats()

      expect(getJWTToken).toHaveBeenCalled()
      expect(createAuthHeaders).toHaveBeenCalledWith(mockJwt)
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/api/quote-trackings?populate=quote&sort=timestamp:desc',
        { headers: mockAuthHeaders },
      )
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/quotes?populate[0]=client', {
        headers: mockAuthHeaders,
      })

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        quoteId: 'quote-123',
        totalViews: 1,
        totalDownloads: 1,
        uniqueSessions: 1,
        lastViewed: '2024-01-15T10:00:00.000Z',
        lastDownloaded: '2024-01-15T11:00:00.000Z',
        events: [mockTrackingEvents[0], mockTrackingEvents[1]],
      })
      expect(result[1]).toEqual({
        quoteId: 'quote-456',
        totalViews: 1,
        totalDownloads: 0,
        uniqueSessions: 1,
        lastViewed: '2024-01-15T12:00:00.000Z',
        events: [mockTrackingEvents[2]],
      })
      expect(result[2]).toEqual({
        quoteId: 'quote-789',
        totalViews: 0,
        totalDownloads: 0,
        uniqueSessions: 0,
        events: [],
      })
    })

    it('returns empty array when no quotes found', async () => {
      ;(axiosInstance.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { data: [] },
        })
        .mockResolvedValueOnce({
          data: { data: [] },
        })

      const result = await getAllQuotesTrackingStats()

      expect(result).toEqual([])
    })

    it('handles events without quote relation', async () => {
      const mockTrackingEvents = [
        {
          id: 1,
          event_type: 'viewed',
          timestamp: '2024-01-15T10:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: 'https://example.com',
          quote: undefined,
        },
        {
          id: 2,
          event_type: 'downloaded',
          timestamp: '2024-01-15T11:00:00.000Z',
          user_agent: 'Mozilla/5.0',
          ip_address: '192.168.1.1',
          session_id: 'session-1',
          referrer: null,
          quote: { documentId: 'quote-123' },
        },
      ]

      const mockQuotes = [{ documentId: 'quote-123' }]

      ;(axiosInstance.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { data: mockTrackingEvents },
        })
        .mockResolvedValueOnce({
          data: { data: mockQuotes },
        })

      const result = await getAllQuotesTrackingStats()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        quoteId: 'quote-123',
        totalViews: 0,
        totalDownloads: 1,
        uniqueSessions: 1,
        lastDownloaded: '2024-01-15T11:00:00.000Z',
        events: [mockTrackingEvents[1]],
      })
    })

    it('handles errors when fetching tracking stats', async () => {
      const error = new Error('API Error') as AxiosError
      ;(axiosInstance.get as jest.Mock).mockRejectedValue(error)

      await expect(getAllQuotesTrackingStats()).rejects.toThrow('API Error')
    })
  })
})
