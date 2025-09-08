import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { axiosInstance, getStrapiImageUrl } from '@/lib/axios'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params

    const quoteResponse = await axiosInstance.get(
      `/api/quotes?filters[documentId][$eq]=${documentId}&populate[0]=client&populate[1]=QuoteItem`,
    )

    const quote = quoteResponse.data.data[0]

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const companyResponse = await axiosInstance.get('/api/company?populate=*').catch(() => null)
    const company = companyResponse?.data?.data || companyResponse?.data || null

    const companyData = company
      ? {
          name: (company.name as string) || '',
          cnpj: (company.cnpj as string) || '',
          address: (company.address as string) || '',
          email: (company.email as string) || '',
          phone: (company.phone as string) || '',
          logo: getStrapiImageUrl((company.logo as Record<string, unknown>)?.url as string),
        }
      : null

    const mappedQuote = {
      ...quote,
      items: quote.QuoteItem || [],
    }

    return NextResponse.json({
      quote: mappedQuote,
      company: companyData,
    })
  } catch (error) {
    console.error('Erro ao buscar quote:', error)
    return NextResponse.json({ error: 'Erro ao buscar orçamento' }, { status: 500 })
  }
}
