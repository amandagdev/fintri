'use client'

import { useEffect } from 'react'

import { Copy, Download, Edit, MessageCircle } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { Quote } from '@/features/quote/state'
import { formatCurrency, formatDate } from '@/lib/utils'

import { DeleteQuoteButton } from '../button-delete/button-delete'
import { StatusSelect } from '../status-select'

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
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr>
                <th className="text-left">{t('title')}</th>
                <th className="text-left">{t('client')}</th>
                <th className="text-center">Status</th>
                <th className="text-right">{t('total_value')}</th>
                <th className="text-right">{t('discount')}</th>
                <th className="text-center">Data de Envio</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: Quote) => (
                <tr key={quote.id} className="hover">
                  <td>
                    <div
                      className="font-semibold text-base-content cursor-pointer hover:text-primary"
                      onClick={() => {
                        const link = `${window.location.origin}/template/${quote.documentId}`
                        window.open(link, '_blank')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          const link = `${window.location.origin}/template/${quote.documentId}`
                          window.open(link, '_blank')
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {quote.title || 'Orçamento'}
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">{quote.client?.name || '-'}</span>
                  </td>
                  <td className="text-center">
                    <StatusSelect
                      currentStatus={quote.status_quote || 'pending'}
                      quoteId={quote.documentId!}
                    />
                  </td>
                  <td className="text-right">
                    <span className="font-semibold">{formatCurrency(quote.total_value)}</span>
                  </td>
                  <td className="text-right">
                    {quote.discount && quote.discount > 0 ? (
                      <span className="font-medium">{formatCurrency(quote.discount)}</span>
                    ) : (
                      <span className="text-base-content/50">-</span>
                    )}
                  </td>
                  <td className="text-center">
                    {quote.quote_send_date ? (
                      <span className="text-sm">{formatDate(quote.quote_send_date)}</span>
                    ) : (
                      <span className="text-base-content/50">-</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/${locale}/quote/edit/${quote.documentId}`)
                        }}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('editButton')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        role="button"
                        tabIndex={0}
                      >
                        <DeleteQuoteButton documentId={quote.documentId!} />
                      </div>
                      <div className="divider divider-horizontal"></div>
                      <button
                        className="btn btn-sm btn-square btn-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = `${window.location.origin}/template/${quote.documentId}`
                          navigator.clipboard.writeText(link)
                          toast.success('Link copiado!')
                        }}
                        aria-label={t('copyLink')}
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button
                        className="btn btn-sm btn-square btn-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast.info('Funcionalidade em desenvolvimento')
                        }}
                        aria-label={t('downloadPDF')}
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast.info('Funcionalidade em desenvolvimento')
                        }}
                        aria-label="Enviar WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
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
              <button
                className="btn btn-primary text-white"
                onClick={() => router.push(`/${locale}/quote/add`)}
              >
                {t('addNewButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
