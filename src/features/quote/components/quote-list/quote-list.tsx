'use client'

import { useEffect } from 'react'

import { Edit } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { Quote } from '@/features/quote/state'
import { formatCurrency, formatDate } from '@/lib/utils'

import { DeleteQuoteButton } from '../button-delete/button-delete'
import { QuoteActions } from '../quote-actions/quote-actions'

interface QuoteListProps {
  readonly quotes: Quote[]
}

export function QuoteList({ quotes }: QuoteListProps) {
  const t = useTranslations('quote')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Extrair o locale do pathname
  const locale = pathname.split('/')[1] || 'pt'

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success(t('successMessage'))
      router.replace(pathname, { scroll: false })
    }
    if (searchParams.get('updated') === 'true') {
      toast.success(t('updateSuccessMessage'))
      router.replace(pathname, { scroll: false })
    }
    if (searchParams.get('deleted') === 'true') {
      toast.success(t('deleteSuccessMessage'))
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams, t, router, pathname])

  console.log(quotes)

  return (
    <>
      {quotes.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr className="border-b-gray-200">
                <th>{t('title')}</th>
                <th>{t('status_quote')}</th>
                <th>{t('client')}</th>
                <th>{t('total_value')}</th>
                <th>{t('discount')}</th>
                <th>{t('quote_send_date')}</th>
                <th>{t('quote_validate_date')}</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: Quote) => (
                <tr key={quote.id} className="hover">
                  <td>{quote.title}</td>
                  <td>pendente</td>
                  <td>{quote.client?.name || '-'}</td>
                  <td>{formatCurrency(quote.total_value)}</td>
                  <td>{formatCurrency(quote.discount)}</td>
                  <td>{formatDate(quote.quote_send_date)}</td>
                  <td>{formatDate(quote.quote_validate_date)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/${locale}/quote/edit/${quote.documentId}`)}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('editButton')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <DeleteQuoteButton documentId={quote.documentId!} />
                      <QuoteActions quoteId={quote.id!} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center rounded-lg">
          <h3 className="text-xl font-semibold">{t('emptyStateTitle')}</h3>
          <p className="mt-2 text-gray-500">{t('emptyStateDescription')}</p>
        </div>
      )}
    </>
  )
}
