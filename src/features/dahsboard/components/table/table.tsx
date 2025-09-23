'use client'

import Link from 'next/link'

import { useTranslations } from 'next-intl'

import type { Quote } from '@/features/quote/state'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Props {
  readonly data: Quote[]
}

export function DashboardTable({ data }: Props) {
  const t = useTranslations('dashboard')

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'Aprovado'
      case 'pending':
        return 'Pendente'
      case 'rejected':
        return 'Rejeitado'
      default:
        return 'Pendente'
    }
  }

  return (
    <>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-primary text-sm font-medium border-b border-gray-200">
                <th className="bg-white">{t('table.title')}</th>
                <th className="bg-white">{t('table.client')}</th>
                <th className="bg-white">{t('table.date')}</th>
                <th className="bg-white">{t('table.status')}</th>
                <th className="bg-white">{t('table.value')}</th>
                <th className="bg-white" colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {data.map((quote) => (
                <tr key={quote.documentId || quote.id} className="hover:bg-gray-50 transition">
                  <td className="py-3">{quote.title}</td>
                  <td className="py-3">{quote.client?.name || '-'}</td>
                  <td>{formatDate(quote.quote_send_date)}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-sm text-xs font-medium ${getStatusClass(
                        quote.status_quote,
                      )}`}
                    >
                      {getStatusLabel(quote.status_quote)}
                    </span>
                  </td>
                  <td>{formatCurrency(quote.total_value)}</td>
                  <td>
                    <Link
                      href={`/template/${quote.documentId || quote.id}`}
                      target="_blank"
                      className="btn btn-sm btn-primary px-4 whitespace-nowrap text-sm"
                    >
                      {t('table.viewProposal')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="hero min-h-[400px] bg-base-200 rounded-lg">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold">{t('emptyStateTitle')}</h3>
              <p className="py-6 text-base-content/70">{t('emptyStateDescription')}</p>
              <Link href="/quote/add" className="btn btn-primary text-white">
                {t('createQuote')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
