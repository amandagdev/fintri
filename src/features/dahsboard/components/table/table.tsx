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
      case 'aprovado':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'pendente':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'recusado':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'aprovado':
        return t('filters.approved')
      case 'pendente':
        return t('filters.pending')
      case 'recusado':
        return t('filters.rejected')
      default:
        return t('filters.pending')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="text-[#1b6d71] text-sm font-medium border-b border-gray-200">
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
                  href={`/quote/edit/${quote.documentId || quote.id}`}
                  className="btn btn-sm px-4 whitespace-nowrap text-sm bg-[#2cb5a0] text-white border-none hover:bg-[#155d61] transition"
                >
                  {t('table.viewProposal')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
