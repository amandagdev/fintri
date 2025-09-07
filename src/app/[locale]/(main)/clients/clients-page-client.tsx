'use client'

import { ClientFilters } from '@/features/clients/components/client-filters'
import { ClientList } from '@/features/clients/components/client-list/client-list'
import { useClientFilters } from '@/features/clients/hooks/use-client-filters'
import type { Client } from '@/features/clients/types'

interface ClientsPageClientProps {
  clients: Client[]
}

export function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const { searchValue, setSearchValue, filteredClients } = useClientFilters({ clients })

  return (
    <>
      <ClientFilters searchValue={searchValue} onSearchChange={setSearchValue} />
      <ClientList clients={filteredClients} />
    </>
  )
}
