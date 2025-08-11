'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'
import Link from 'next/link'

import FilterSelect from '@/common/components/filter-select/filter-select'
import SearchBar from '@/common/components/search-bar/search-bar'
import Tabs from '@/common/components/tabs/tabs'

export default function ListingHeader() {
  const [activeTab, setActiveTab] = useState('submitted')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const tabs = [
    { label: 'Enviado', value: 'submitted' },
    { label: 'Ativo', value: 'active' },
    { label: 'Arquivado', value: 'archived' },
  ]

  const filterOptions = [
    { label: 'Todos os status', value: 'all' },
    { label: 'Aprovado', value: 'approved' },
    { label: 'Pendente', value: 'pending' },
    { label: 'Recusado', value: 'rejected' },
  ]

  return (
    <div className="bg-white flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-600">Orçamentos</h2>
        <Link
          href="/dashboard/budgets/create"
          className="btn bg-[#2cb5a0] text-white flex items-center gap-2 border-none w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Criar Orçamento
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full justify-between">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <FilterSelect label="Filtrar" options={filterOptions} value={filter} onChange={setFilter} />
        <SearchBar placeholder="Buscar..." value={search} onChange={setSearch} />
      </div>
    </div>
  )
}
