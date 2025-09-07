'use client'

import { QuoteFilters } from '@/features/quote/components/quote-filters'
import { QuoteList } from '@/features/quote/components/quote-list/quote-list'
import { useQuoteFilters } from '@/features/quote/hooks/use-quote-filters'
import type { Quote } from '@/features/quote/state'

interface QuotePageClientProps {
  quotes: Quote[]
}

export function QuotePageClient({ quotes }: QuotePageClientProps) {
  const {
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,
    filteredQuotes,
    uniqueClients,
  } = useQuoteFilters({ quotes })

  return (
    <>
      <QuoteFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        clientFilter={clientFilter}
        onClientFilterChange={setClientFilter}
        clients={uniqueClients}
      />
      <QuoteList quotes={filteredQuotes} />
    </>
  )
}
