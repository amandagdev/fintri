'use client'

import FilterSelect from '@/common/components/filter-select/filter-select'
import SearchBar from '@/common/components/search-bar/search-bar'

interface QuoteFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  clientFilter: string
  onClientFilterChange: (value: string) => void
  clients: Array<{ id: string; name: string }>
}

export function QuoteFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
  clients,
}: QuoteFiltersProps) {
  const statusOptions = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Aprovado', value: 'aprovado' },
    { label: 'Rejeitado', value: 'rejeitado' },
    { label: 'Enviado', value: 'enviado' },
  ]

  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }))

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-base-100 rounded-lg border border-base-200">
      <div className="flex-1">
        <SearchBar
          placeholder="Buscar orçamentos..."
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterSelect
          label="Todos os status"
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
        />
        <FilterSelect
          label="Todos os clientes"
          options={clientOptions}
          value={clientFilter}
          onChange={onClientFilterChange}
        />
      </div>
    </div>
  )
}
