import { getTranslations } from 'next-intl/server'

import Header from '@/features/dahsboard/components/header/header'
import { StatsCards } from '@/features/dahsboard/components/stats-cards'
import { DashboardTable } from '@/features/dahsboard/components/table/table'
import { getQuotes } from '@/features/quote/services/service'
import type { Quote } from '@/features/quote/state'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  let quotes: Quote[] = []
  let error: string | null = null

  try {
    quotes = await getQuotes()
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
          <DashboardTable data={quotes} />
        </>
      )}
    </main>
  )
}
