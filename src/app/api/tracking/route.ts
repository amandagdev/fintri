import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { axiosInstance } from '@/lib/axios'

export async function POST(request: NextRequest) {
  try {
    const { documentId, eventType, timestamp, userAgent, referrer } = await request.json()

    if (!documentId || !eventType || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, eventType, timestamp' },
        { status: 400 },
      )
    }

    if (!['viewed', 'downloaded'].includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid eventType. Must be "viewed" or "downloaded"' },
        { status: 400 },
      )
    }

    const clientIP =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    const sessionId =
      request.headers.get('x-session-id') ||
      `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    const quoteResponse = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}`,
    )
    const quote = quoteResponse.data.data?.[0]

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const trackingData = {
      data: {
        quote: quote.id,
        event_type: eventType,
        user_agent: userAgent || 'unknown',
        ip_address: clientIP,
        timestamp: new Date(timestamp).toISOString(),
        session_id: sessionId,
        referrer: referrer || null,
      },
    }

    await axiosInstance.post('/api/quote-trackings', trackingData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking quote event:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
