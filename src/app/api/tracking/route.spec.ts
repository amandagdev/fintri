import type { NextRequest } from 'next/server'

import { axiosInstance } from '@/lib/axios'

// Mock Next.js Response
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}))

import { POST } from './route'

jest.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

describe('/api/tracking POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: Record<string, unknown>) =>
    ({
      json: jest.fn().mockResolvedValue(body),
      headers: {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'x-forwarded-for') return '192.168.1.1'
          if (key === 'x-real-ip') return '192.168.1.1'
          if (key === 'x-session-id') return null
          return null
        }),
      },
    }) as unknown as NextRequest

  it('successfully tracks a viewed event', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
      userAgent: 'Mozilla/5.0',
      referrer: 'https://example.com',
    }

    const mockQuote = {
      id: 1,
      documentId: 'quote-123',
      title: 'Test Quote',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: [mockQuote] },
    })
    ;(axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { id: 1, success: true },
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData).toEqual({ success: true })

    expect(axiosInstance.get).toHaveBeenCalledWith('/api/quotes?filters[documentId][$eq]=quote-123')
    expect(axiosInstance.post).toHaveBeenCalledWith('/api/quote-trackings', {
      data: {
        quote: 1,
        event_type: 'viewed',
        user_agent: 'Mozilla/5.0',
        ip_address: '192.168.1.1',
        timestamp: '2024-01-15T10:00:00.000Z',
        session_id: expect.stringMatching(/^session_\d+_[a-z0-9]+$/),
        referrer: 'https://example.com',
      },
    })
  })

  it('successfully tracks a downloaded event', async () => {
    const mockBody = {
      documentId: 'quote-456',
      eventType: 'downloaded',
      timestamp: '2024-01-15T11:00:00.000Z',
      userAgent: 'Mozilla/5.0',
      referrer: null,
    }

    const mockQuote = {
      id: 2,
      documentId: 'quote-456',
      title: 'Another Quote',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: [mockQuote] },
    })
    ;(axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { id: 2, success: true },
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData).toEqual({ success: true })

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/quote-trackings', {
      data: {
        quote: 2,
        event_type: 'downloaded',
        user_agent: 'Mozilla/5.0',
        ip_address: '192.168.1.1',
        timestamp: '2024-01-15T11:00:00.000Z',
        session_id: expect.stringMatching(/^session_\d+_[a-z0-9]+$/),
        referrer: null,
      },
    })
  })

  it('returns 400 when documentId is missing', async () => {
    const mockBody = {
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
    }

    const mockRequest = createMockRequest(mockBody)

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData).toEqual({
      error: 'Missing required fields: documentId, eventType, timestamp',
    })

    expect(axiosInstance.get).not.toHaveBeenCalled()
    expect(axiosInstance.post).not.toHaveBeenCalled()
  })

  it('returns 400 when eventType is missing', async () => {
    const mockBody = {
      documentId: 'quote-123',
      timestamp: '2024-01-15T10:00:00.000Z',
    }

    const mockRequest = createMockRequest(mockBody)

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData).toEqual({
      error: 'Missing required fields: documentId, eventType, timestamp',
    })

    expect(axiosInstance.get).not.toHaveBeenCalled()
    expect(axiosInstance.post).not.toHaveBeenCalled()
  })

  it('returns 400 when timestamp is missing', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'viewed',
    }

    const mockRequest = createMockRequest(mockBody)

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData).toEqual({
      error: 'Missing required fields: documentId, eventType, timestamp',
    })

    expect(axiosInstance.get).not.toHaveBeenCalled()
    expect(axiosInstance.post).not.toHaveBeenCalled()
  })

  it('returns 400 when eventType is invalid', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'invalid-event',
      timestamp: '2024-01-15T10:00:00.000Z',
    }

    const mockRequest = createMockRequest(mockBody)

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData).toEqual({
      error: 'Invalid eventType. Must be "viewed" or "downloaded"',
    })

    expect(axiosInstance.get).not.toHaveBeenCalled()
    expect(axiosInstance.post).not.toHaveBeenCalled()
  })

  it('returns 404 when quote is not found', async () => {
    const mockBody = {
      documentId: 'non-existent-quote',
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
      userAgent: 'Mozilla/5.0',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: [] },
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(404)
    expect(responseData).toEqual({ error: 'Quote not found' })

    expect(axiosInstance.get).toHaveBeenCalledWith(
      '/api/quotes?filters[documentId][$eq]=non-existent-quote',
    )
    expect(axiosInstance.post).not.toHaveBeenCalled()
  })

  it('returns 500 when API call fails', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
      userAgent: 'Mozilla/5.0',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockRejectedValue(new Error('API Error'))

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData).toEqual({ error: 'Failed to track event' })
  })

  it('handles missing userAgent and referrer', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
    }

    const mockQuote = {
      id: 1,
      documentId: 'quote-123',
      title: 'Test Quote',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: [mockQuote] },
    })
    ;(axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { id: 1, success: true },
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData).toEqual({ success: true })

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/quote-trackings', {
      data: {
        quote: 1,
        event_type: 'viewed',
        user_agent: 'unknown',
        ip_address: '192.168.1.1',
        timestamp: '2024-01-15T10:00:00.000Z',
        session_id: expect.stringMatching(/^session_\d+_[a-z0-9]+$/),
        referrer: null,
      },
    })
  })

  it('generates session ID when not provided in headers', async () => {
    const mockBody = {
      documentId: 'quote-123',
      eventType: 'viewed',
      timestamp: '2024-01-15T10:00:00.000Z',
      userAgent: 'Mozilla/5.0',
    }

    const mockQuote = {
      id: 1,
      documentId: 'quote-123',
      title: 'Test Quote',
    }

    const mockRequest = createMockRequest(mockBody)

    ;(axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { data: [mockQuote] },
    })
    ;(axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { id: 1, success: true },
    })

    await POST(mockRequest)

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/quote-trackings', {
      data: expect.objectContaining({
        session_id: expect.stringMatching(/^session_\d+_[a-z0-9]+$/),
      }),
    })
  })
})
