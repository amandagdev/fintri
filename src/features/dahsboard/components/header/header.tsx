'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import FilterSelect from '@/common/components/filter-select/filter-select'
import SearchBar from '@/common/components/search-bar/search-bar'
import Tabs from '@/common/components/tabs/tabs'

export default function ListingHeader() {
  const t = useTranslations('dashboard')
  const [activeTab, setActiveTab] = useState('submitted')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const tabs = [
    { label: t('tabs.submitted'), value: 'submitted' },
    { label: t('tabs.active'), value: 'active' },
    { label: t('tabs.archived'), value: 'archived' },
  ]

  const filterOptions = [
    { label: t('filters.all'), value: 'all' },
    { label: t('filters.approved'), value: 'approved' },
    { label: t('filters.pending'), value: 'pending' },
    { label: t('filters.rejected'), value: 'rejected' },
  ]

  return (
    <div className="bg-white flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-600">{t('title')}</h2>
        <Link
          href="/quote/add"
          className="btn bg-[#2cb5a0] text-white flex items-center gap-2 border-none w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {t('createQuote')}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full justify-between">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <FilterSelect
          label={t('filterLabel')}
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
        <SearchBar placeholder={t('searchPlaceholder')} value={search} onChange={setSearch} />
      </div>
    </div>
  )
}
