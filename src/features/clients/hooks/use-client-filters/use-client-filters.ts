'use client'

import { useMemo, useState } from 'react'

import type { Client } from '@/features/clients/types'

interface UseClientFiltersProps {
  clients: Client[]
}

export function useClientFilters({ clients }: UseClientFiltersProps) {
  const [searchValue, setSearchValue] = useState('')

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Filtro de busca (nome, email)
      const matchesSearch =
        searchValue === '' ||
        client.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchValue.toLowerCase())

      return matchesSearch
    })
  }, [clients, searchValue])

  return {
    // Estados
    searchValue,

    // Setters
    setSearchValue,

    // Dados filtrados
    filteredClients,
  }
}
