import { getTranslations } from 'next-intl/server'

import Header from '@/features/dahsboard/components/header/header'
import { StatsCards } from '@/features/dahsboard/components/stats-cards'
import { DashboardTable } from '@/features/dahsboard/components/table/table'
import { TrackingStats } from '@/features/dahsboard/components/tracking-stats'
import { getQuotes } from '@/features/quote/services/service'
import type { QuoteTrackingStats } from '@/features/quote/services/tracking-service'
import { getAllQuotesTrackingStats } from '@/features/quote/services/tracking-service'
import type { Quote } from '@/features/quote/state'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  let quotes: Quote[] = []
  let error: string | null = null
  let trackingStats: QuoteTrackingStats[] = []

  try {
    quotes = await getQuotes()
    trackingStats = await getAllQuotesTrackingStats()
  } catch (err) {
    console.error('Error fetching quotes:', err)
    error = err instanceof Error ? err.message : 'Erro desconhecido'
  }

  return (
    <main className="bg-white p-4 sm:p-6 space-y-4 sm:space-y-6 w-full min-h-screen">
      <div className="space-y-4">
        <Header />
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{t('errorLoadingQuotes')}</span>
          <details className="mt-2 text-sm opacity-75">{error}</details>
        </div>
      ) : (
        <>
          <StatsCards quotes={quotes} />
          <TrackingStats
            quotes={quotes.map((q) => ({
              documentId: q.documentId || q.id || '',
              title: q.title || 'Orçamento',
            }))}
            stats={trackingStats}
          />
          <DashboardTable data={quotes} />
        </>
      )}
    </main>
  )
}
