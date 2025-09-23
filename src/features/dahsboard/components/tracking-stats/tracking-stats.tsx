'use client'

import { Clock, Download, Eye } from 'lucide-react'

import { useTranslations } from 'next-intl'

import type { QuoteTrackingStats } from '@/features/quote/services/tracking-service'
import { formatDate } from '@/lib/utils'

interface TrackingStatsProps {
  quotes: Array<{ documentId: string; title: string }>
  stats: QuoteTrackingStats[]
}

export function TrackingStats({ quotes, stats }: Readonly<TrackingStatsProps>) {
  const t = useTranslations('dashboard.tracking')
  const totalViews = stats.reduce((sum, stat) => sum + stat.totalViews, 0)
  const totalDownloads = stats.reduce((sum, stat) => sum + stat.totalDownloads, 0)
  const quotesWithActivity = stats.filter((stat) => stat.totalViews > 0).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{t('title')}</h3>

        <div className="grid grid-cols-3 gap-6 h-24">
          <div className="text-center flex flex-col justify-center items-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalViews}</div>
            <div className="text-sm text-gray-600">{t('totalViews')}</div>
          </div>

          <div className="text-center flex flex-col justify-center items-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{totalDownloads}</div>
            <div className="text-sm text-gray-600">{t('totalDownloads')}</div>
          </div>

          <div className="text-center flex flex-col justify-center items-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{quotesWithActivity}</div>
            <div className="text-sm text-gray-600">{t('activeQuotes')}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col max-h-60">
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('recentActivity')}</h3>
              <p className="text-xs text-gray-500">{t('recentActivityDesc')}</p>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {stats.filter((stat) => stat.events.length > 0).length > 0 ? (
            <div className="space-y-2">
              {stats
                .filter((stat) => stat.events.length > 0)
                .sort((a, b) => {
                  const aLastViewed = a.lastViewed ? new Date(a.lastViewed).getTime() : 0
                  const bLastViewed = b.lastViewed ? new Date(b.lastViewed).getTime() : 0
                  return bLastViewed - aLastViewed
                })
                .map((stat, _index) => {
                  const quote = quotes.find((q) => q.documentId === stat.quoteId)
                  const hasViews = stat.totalViews > 0
                  const hasDownloads = stat.totalDownloads > 0

                  return (
                    <div
                      key={stat.quoteId}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {quote?.title || 'Orçamento'}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          {hasViews && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-gray-600">{stat.totalViews}</span>
                            </div>
                          )}
                          {hasDownloads && (
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-gray-600">{stat.totalDownloads}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-medium text-gray-900">
                          {stat.lastViewed ? formatDate(stat.lastViewed) : 'Nunca visualizado'}
                        </p>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('noRecentActivity')}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">{t('noRecentActivityDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
