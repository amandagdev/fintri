import { notFound } from 'next/navigation'

import type { Company } from '@/features/account/types'
import QuoteTemplate from '@/features/quote/components/quote-template/quote-template'
import type { Quote } from '@/features/quote/state'

interface Props {
  params: Promise<{
    documentId: string
  }>
}

async function getPublicQuote(
  documentId: string,
): Promise<{ quote: Quote; company: Company | null } | null> {
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
  const data = await getPublicQuote(documentId)

  if (!data) {
    notFound()
  }

  return <QuoteTemplate quote={data.quote} company={data.company} />
}
