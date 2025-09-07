import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { axiosInstance } from '@/lib/axios'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params

    const response = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}&populate[0]=client&populate[1]=QuoteItem`,
    )

    const quote = response.data.data[0]

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Mapear QuoteItem para items
    const mappedQuote = {
      ...quote,
      items: quote.QuoteItem || [],
    }

    console.log('Quote data:', JSON.stringify(mappedQuote, null, 2))

    return NextResponse.json(mappedQuote)
  } catch (error) {
    console.error('Erro ao buscar quote:', error)
    return NextResponse.json({ error: 'Erro ao buscar orçamento' }, { status: 500 })
  }
}
