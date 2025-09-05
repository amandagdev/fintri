import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { QuoteList } from '@/features/quote/components/quote-list/quote-list'
import { getQuotes } from '@/features/quote/services/service'

export default async function QuotePage() {
  const t = await getTranslations('quote')
  const quotes = await getQuotes()

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('listTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('listDescription')}</p>
        </div>
        <Link href="/quote/add" className="btn bg-[#1b6d71] text-white">
          <Plus className="w-4 h-4" />
          {t('addNewButton')}
        </Link>
      </header>
      <QuoteList quotes={quotes} />
    </main>
  )
}
