import { notFound } from 'next/navigation'

import { getTranslations } from 'next-intl/server'

import { getClients } from '@/features/clients/services/service'
import { updateQuoteAction } from '@/features/quote/actions/actions'
import { QuoteForm } from '@/features/quote/components/quote-form/quote-form'
import { getQuoteByDocumentId } from '@/features/quote/services/service'

interface EditQuotePageProps {
  params: Promise<{ documentId: string }>
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const { documentId } = await params

  const t = await getTranslations('quote')
  const [quote, clients] = await Promise.all([getQuoteByDocumentId(documentId), getClients()])

  if (!quote || !quote.documentId) {
    notFound()
  }

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('editQuote')}</h1>
        <p className="text-gray-500 mt-1">
          {t('editQuoteDescription', { quoteName: quote.title || 'Orçamento' })}
        </p>
      </header>

      <QuoteForm
        action={updateQuoteAction.bind(null, quote.documentId)}
        data={quote}
        clients={clients}
      />
    </main>
  )
}
