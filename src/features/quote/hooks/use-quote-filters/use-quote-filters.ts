'use client'

import { useMemo, useState } from 'react'

import type { Quote } from '@/features/quote/state'

interface UseQuoteFiltersProps {
  quotes: Quote[]
}

export function useQuoteFilters({ quotes }: UseQuoteFiltersProps) {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [clientFilter, setClientFilter] = useState('')

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      // Filtro de busca (título, cliente)
      const matchesSearch =
        searchValue === '' ||
        quote.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        quote.client?.name?.toLowerCase().includes(searchValue.toLowerCase())

      // Filtro de status (por enquanto todos são "pendente")
      const matchesStatus = statusFilter === '' || statusFilter === 'pendente'

      // Filtro de cliente
      const matchesClient = clientFilter === '' || String(quote.client?.id) === clientFilter

      return matchesSearch && matchesStatus && matchesClient
    })
  }, [quotes, searchValue, statusFilter, clientFilter])

  const uniqueClients = useMemo(() => {
    const clientMap = new Map()
    quotes.forEach((quote) => {
      if (quote.client?.id && quote.client?.name) {
        const clientId = String(quote.client.id)
        clientMap.set(clientId, {
          id: clientId,
          name: quote.client.name,
        })
      }
    })
    return Array.from(clientMap.values())
  }, [quotes])

  return {
    // Estados
    searchValue,
    statusFilter,
    clientFilter,

    // Setters
    setSearchValue,
    setStatusFilter,
    setClientFilter,

    // Dados filtrados
    filteredQuotes,
    uniqueClients,
  }
}
