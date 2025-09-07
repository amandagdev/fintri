import { notFound } from 'next/navigation'

import QuoteTemplate from '@/features/quote/components/quote-template/quote-template'
import type { Quote } from '@/features/quote/state'

interface Props {
  params: Promise<{
    documentId: string
  }>
}

async function getPublicQuote(documentId: string): Promise<Quote | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public-quote/${documentId}`,
      {
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
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
