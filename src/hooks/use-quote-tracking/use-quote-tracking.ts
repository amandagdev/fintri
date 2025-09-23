'use client'

import { useCallback } from 'react'

interface TrackingEvent {
  documentId: string
  eventType: 'viewed' | 'downloaded'
  userAgent?: string
  referrer?: string
}

export function useQuoteTracking() {
  const trackEvent = useCallback(
    async ({ documentId, eventType, userAgent, referrer }: TrackingEvent) => {
      try {
        await fetch('/api/tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId,
            eventType,
            timestamp: new Date().toISOString(),
            userAgent: userAgent || navigator.userAgent,
            referrer: referrer || document.referrer,
          }),
        })
      } catch (error) {
        console.error('Failed to track event:', error)
      }
    },
    [],
  )

  return { trackEvent }
}
