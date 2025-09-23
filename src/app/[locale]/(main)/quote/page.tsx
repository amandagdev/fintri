import Link from 'next/link'

import { Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { getQuotes } from '@/features/quote/services/service'

import { QuotePageClient } from './quote-page-client'

export default async function QuotePage() {
  const t = await getTranslations('quote')
  const quotes = await getQuotes()

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('listTitle')}</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('listDescription')}</p>
        </div>
        <Link
          href="/quote/add"
          className="btn btn-primary text-white w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {t('addNewButton')}
        </Link>
      </header>
      <QuotePageClient quotes={quotes} />
    </main>
  )
}
