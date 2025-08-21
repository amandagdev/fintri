import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { updateQuoteAction } from '@/features/quote/actions'
import { QuoteForm } from '@/features/quote/components/quote-form/quote-form'
import { getQuoteById } from '@/features/quote/services/service'

interface EditQuotePageProps {
  params: {
    id: string
  }
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const t = await getTranslations('quote')
  const quote = await getQuoteById(params.id)

  if (!quote) {
    notFound()
  }

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('editQuote')}</h1>
        <p className="text-gray-500 mt-1">
          {t('editQuoteDescription', { quoteName: quote.title })}
        </p>
      </header>
      <QuoteForm action={updateQuoteAction} data={quote} />
    </main>
  )
}
