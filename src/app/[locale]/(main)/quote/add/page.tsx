import { getTranslations } from 'next-intl/server'

import { addQuoteAction } from '@/features/quote/actions'
import { QuoteForm } from '@/features/quote/components/quote-form/quote-form'

export default async function AddQuotePage() {
  const t = await getTranslations('quote')

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('addQuote')}</h1>
        <p className="text-gray-500 mt-1">{t('addQuoteDescription')}</p>
      </header>
      <QuoteForm action={addQuoteAction} />
    </main>
  )
}
