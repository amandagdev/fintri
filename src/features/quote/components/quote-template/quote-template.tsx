'use client'

import { useRef } from 'react'

import { Copy, Download, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { Company } from '@/features/account/types'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'

import type { Quote } from '../../state'
import { generateQuotePDF } from '../../utils/pdf-generator'
import {
  copyToClipboard,
  handleButtonState,
  shareToWhatsAppFromTemplate,
} from '../../utils/share-utils'

interface Props {
  readonly quote: Quote
  readonly company?: Company | null
}

export default function QuoteTemplate({ quote, company }: Props) {
  const t = useTranslations('quote')
  const templateRef = useRef<HTMLDivElement>(null)

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('template.pending')
      case 'accepted':
        return t('template.accepted')
      case 'rejected':
        return t('template.rejected')
      case 'expired':
        return t('template.expired')
      default:
        return t('template.pending')
    }
  }

  const getDisplayData = () => {
    return {
      name: company?.name || quote.client?.name || '',
      address: company?.address || '',
      email: company?.email || quote.client?.email || '',
      phone: company?.phone || quote.client?.phone || '',
      logo: company?.logo || '',
    }
  }

  const handleDownload = async () => {
    const button = document.querySelector('[data-download-button]') as HTMLButtonElement
    if (!button) return

    button.setAttribute('data-original-content', button.innerHTML)

    await generateQuotePDF({
      documentId: quote.documentId || quote.id || '',
      fileName: `orcamento-${quote.documentId || quote.id || 'unknown'}.pdf`,
      onProgress: (message) => {
        handleButtonState(button, true, message)
      },
      onError: (error) => {
        alert(error)
        handleButtonState(button, false)
      },
      onSuccess: () => {
        handleButtonState(button, false)
      },
    })
  }

  const handleShare = () => {
    shareToWhatsAppFromTemplate(quote.title || 'Orçamento')
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href)
    if (success) {
      toast.success(t('copyLinkSuccess'))
    } else {
      toast.error(t('copyLinkError'))
    }
  }

  const displayData = getDisplayData()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { margin: 0; padding: 0; }
              .min-h-screen { min-height: auto !important; padding: 0 !important; }
              .max-w-4xl { max-width: none !important; margin: 0 !important; padding: 0 !important; }
              .bg-gray-50 { background: white !important; }
              .py-8 { padding: 0 !important; }
              .mb-6 { margin-bottom: 1rem !important; }
              .pb-6 { padding-bottom: 1rem !important; }
              .gap-4 { gap: 0.5rem !important; }
            }
          `,
        }}
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            {quote.client?.name ? (
              <>
                <p className="text-sm text-gray-600 mb-1">{t('template.welcome')}</p>
                <h1 className="text-2xl font-bold text-gray-800">{quote.client.name},</h1>
                <p className="text-sm text-gray-600 mt-1">{t('template.welcomeWithName')}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-800">{t('template.welcome')},</h1>
                <p className="text-sm text-gray-600 mt-1">{t('template.welcomeWithoutName')}</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="btn btn-outline btn-sm"
              data-download-button
            >
              <Download className="w-4 h-4" />
              {t('pdf.downloadButton')}
            </button>
            <button onClick={handleCopyLink} className="btn btn-outline btn-sm">
              <Copy className="w-4 h-4" />
              {t('copyLink')}
            </button>
            <button onClick={handleShare} className="btn btn-outline btn-sm">
              <Share2 className="w-4 h-4" />
              {t('pdf.shareButton')}
            </button>
          </div>
        </div>

        <div
          ref={templateRef}
          className="bg-white rounded-lg shadow-lg p-8 print:p-4 print:shadow-none print:rounded-none"
        >
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                {displayData.logo && (
                  <img
                    src={displayData.logo}
                    alt="Logo da empresa"
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{displayData.name}</h2>
                  {displayData.address && (
                    <p className="text-gray-600">
                      <span className="font-medium">Endereço:</span> {displayData.address}
                    </p>
                  )}
                  {displayData.email && (
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {displayData.email}
                    </p>
                  )}
                  {displayData.phone && (
                    <p className="text-gray-600">
                      <span className="font-medium">Telefone:</span>{' '}
                      {formatPhone(displayData.phone)}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">{t('template.quoteNumber')}</div>
                <div className="text-lg font-semibold text-gray-800">#{quote.documentId}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('template.quoteDetails')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">{t('template.sendDate')}</div>
                <p className="font-medium text-gray-800">{formatDate(quote.quote_send_date)}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('template.validateDate')}</div>
                <p className="font-medium text-gray-800">{formatDate(quote.quote_validate_date)}</p>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('template.status')}</div>
                <p className="font-medium text-gray-800">
                  {getStatusText(quote.status_quote || 'pending')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {quote.items && quote.items.length > 0
                ? t('template.items')
                : t('template.productItem')}
            </h3>
            {quote.items && quote.items.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-sm font-medium text-gray-600">{t('template.type')}</th>
                        <th className="text-sm font-medium text-gray-600">
                          {t('template.itemName')}
                        </th>
                        <th className="text-sm font-medium text-gray-600 text-center">
                          {t('template.quantity')}
                        </th>
                        <th className="text-sm font-medium text-gray-600 text-right">
                          {t('template.unitPrice')}
                        </th>
                        <th className="text-sm font-medium text-gray-600 text-right">
                          {t('template.itemTotal')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, index) => (
                        <tr key={`${item.item_type}-${item.item_name}-${index}`}>
                          <td>
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              {item.item_type === 'service' ? t('form.service') : t('form.product')}
                            </span>
                          </td>
                          <td>
                            <div className="font-medium text-gray-800">{item.item_name}</div>
                          </td>
                          <td className="text-center">
                            <span className="text-sm text-gray-700">{item.quantity}</span>
                          </td>
                          <td className="text-right">
                            <span className="text-sm text-gray-700">
                              {formatCurrency(item.unit_price)}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className="text-sm font-semibold text-gray-700">
                              {formatCurrency(item.total)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">{quote.title}</p>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('template.description')}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{quote.description || t('template.noDescription')}</p>
            </div>
          </div>

          {/* Observações */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('template.observations')}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{quote.observations || t('template.noObservations')}</p>
            </div>
          </div>

          {/* Resumo financeiro */}
          <div className="border-t border-gray-200 pt-6">
            <div className="max-w-md ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('template.subtotal')}</span>
                  <span className="font-medium">{formatCurrency(quote.total_value)}</span>
                </div>
                {quote.discount && quote.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('template.discount')}</span>
                    <span>-{formatCurrency(quote.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('template.total')}</span>
                    <span>{formatCurrency(quote.total_value - (quote.discount || 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
