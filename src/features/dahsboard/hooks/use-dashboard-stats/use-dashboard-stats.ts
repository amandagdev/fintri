import { useMemo } from 'react'

import type { Quote } from '@/features/quote/state'

interface UseDashboardStatsProps {
  quotes: Quote[]
}

export function useDashboardStats({ quotes }: UseDashboardStatsProps) {
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const totalQuotes = quotes.length

    const currentMonthQuotes = quotes.filter((quote) => {
      if (!quote.quote_send_date) return false
      const quoteDate = new Date(quote.quote_send_date)
      return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear
    })

    const acceptedQuotes = quotes.filter((quote) => quote.status_quote === 'accepted')
    const totalAcceptedValue = acceptedQuotes.reduce(
      (sum, quote) => sum + (quote.total_value || 0),
      0,
    )

    const sentQuotes = quotes.filter((quote) => quote.quote_send_date)
    const conversionRate =
      sentQuotes.length > 0 ? (acceptedQuotes.length / sentQuotes.length) * 100 : 0

    return {
      totalQuotes,
      currentMonthQuotes: currentMonthQuotes.length,
      totalAcceptedValue,
      conversionRate,
    }
  }, [quotes])

  return stats
}
