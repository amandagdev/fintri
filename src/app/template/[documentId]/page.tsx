import { notFound } from 'next/navigation'

import QuoteTemplate from '@/features/quote/components/quote-template/quote-template'
import type { Quote } from '@/features/quote/state'
import { axiosInstance } from '@/lib/axios'

interface Props {
  params: Promise<{
    documentId: string
  }>
}

async function getPublicQuote(documentId: string): Promise<Quote | null> {
  try {
    const response = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}&populate[0]=client&populate[1]=QuoteItem`,
    )

    const quote = response.data.data[0]

    if (!quote) {
      return null
    }

    return {
      ...quote,
      items: quote.QuoteItem || [],
    }
  } catch (error) {
    console.error('Erro ao buscar quote:', error)
    return null
  }
}

export default async function QuoteTemplatePage({ params }: Props) {
  const { documentId } = await params
  const quote = await getPublicQuote(documentId)

  if (!quote) {
    notFound()
  }

  return <QuoteTemplate quote={quote} />
}
