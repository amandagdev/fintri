'use client'

import SearchBar from '@/common/components/search-bar/search-bar'

interface ClientFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function ClientFilters({ searchValue, onSearchChange }: ClientFiltersProps) {
  return (
    <div className="flex justify-end mb-6 p-4 bg-base-100 rounded-lg border border-base-200">
      <div className="w-full sm:w-64">
        <SearchBar placeholder="Buscar clientes..." value={searchValue} onChange={onSearchChange} />
      </div>
    </div>
  )
}
