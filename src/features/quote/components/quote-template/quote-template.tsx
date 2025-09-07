'use client'

import { useEffect, useRef, useState } from 'react'

import { Download, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Company, User } from '@/features/account/types'
import { formatCurrency, formatDate } from '@/lib/utils'

import type { Quote } from '../../state'
import { generateQuotePDF } from '../../utils/pdf-generator'

interface Props {
  readonly quote: Quote
}

export default function QuoteTemplate({ quote }: Props) {
  const t = useTranslations('quote')
  const templateRef = useRef<HTMLDivElement>(null)
  const [companyData, setCompanyData] = useState<Company | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/quote-data')
        const data = await response.json()

        if (response.ok) {
          setCompanyData(data.company)
          setUserData(data.user)
        } else {
          console.error('Erro ao buscar dados:', data.error)
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getDisplayData = () => {
    return {
      name: companyData?.name || userData?.username,
      address: companyData?.address,
      email: companyData?.email || userData?.email,
      logo: companyData?.logo || '',
    }
  }

  const handleDownload = async () => {
    if (!templateRef.current) return

    const button = document.querySelector('[data-download-button]') as HTMLButtonElement
    const originalContent = button?.innerHTML

    await generateQuotePDF({
      element: templateRef.current,
      fileName: `orcamento-${quote.documentId || quote.id}.pdf`,
      onProgress: (message) => {
        if (button) {
          button.disabled = true
          button.innerHTML = `<span class="loading loading-spinner loading-sm"></span> ${message}`
        }
      },
      onError: (error) => {
        alert(error)
        if (button && originalContent) {
          button.disabled = false
          button.innerHTML = originalContent
        }
      },
      onSuccess: () => {
        if (button && originalContent) {
          button.disabled = false
          button.innerHTML = originalContent
        }
      },
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Orçamento - ${quote.title}`,
        text: `Orçamento: ${quote.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Mostrar toast de sucesso
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    )
  }

  const displayData = getDisplayData()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com ações */}
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
            <button onClick={handleShare} className="btn btn-outline btn-sm">
              <Share2 className="w-4 h-4" />
              {t('pdf.shareButton')}
            </button>
          </div>
        </div>

        {/* Template do orçamento */}
        <div ref={templateRef} className="bg-white rounded-lg shadow-lg p-8">
          {/* Cabeçalho */}
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
                  <p className="text-gray-600">{displayData.address}</p>
                  <p className="text-gray-600">{displayData.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">{t('template.quoteNumber')}</div>
                <div className="text-lg font-semibold text-gray-800">#{quote.documentId}</div>
              </div>
            </div>
          </div>

          {/* Detalhes do orçamento */}
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
                  {quote.status_quote || t('template.pending')}
                </p>
              </div>
            </div>
          </div>

          {/* Produto/Item ou Itens do Orçamento */}
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
