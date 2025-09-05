'use client'

import { useEffect } from 'react'

import { Edit } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { Quote } from '@/features/quote/state'

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
                <th className="text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: Quote) => (
                <tr key={quote.id} className="hover">
                  <td>{quote.title}</td>
                  <td>{t(`status.${quote.status_quote}`)}</td>
                  <td>{quote.client?.name || '-'}</td>
                  <td>{quote.total_value}</td>
                  <td>{quote.discount || '-'}</td>
                  <td>{quote.quote_send_date}</td>
                  <td>{quote.quote_validate_date}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/quotes/edit/${quote.id}`}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('editButton')}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteQuoteButton id={quote.id!} />
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
