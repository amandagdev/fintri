'use client'

import { Clock, Download, Eye, Users } from 'lucide-react'

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
  const totalUniqueSessions = stats.reduce((sum, stat) => sum + stat.uniqueSessions, 0)
  const quotesWithActivity = stats.filter((stat) => stat.totalViews > 0).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
          <div className="stat-figure text-gray-800">
            <Eye className="w-8 h-8" />
          </div>
          <div className="stat-title text-gray-600">{t('totalViews')}</div>
          <div className="stat-value text-gray-800">{totalViews}</div>
          <div className="stat-desc text-gray-500">{t('totalViewsDesc')}</div>
        </div>

        <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
          <div className="stat-figure text-gray-800">
            <Download className="w-8 h-8" />
          </div>
          <div className="stat-title text-gray-600">{t('totalDownloads')}</div>
          <div className="stat-value text-gray-800">{totalDownloads}</div>
          <div className="stat-desc text-gray-500">{t('totalDownloadsDesc')}</div>
        </div>

        <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
          <div className="stat-figure text-gray-800">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title text-gray-600">{t('uniqueSessions')}</div>
          <div className="stat-value text-gray-800">{totalUniqueSessions}</div>
          <div className="stat-desc text-gray-500">{t('uniqueSessionsDesc')}</div>
        </div>

        <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
          <div className="stat-figure text-gray-800">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-title text-gray-600">{t('activeQuotes')}</div>
          <div className="stat-value text-gray-800">{quotesWithActivity}</div>
          <div className="stat-desc text-gray-500">{t('activeQuotesDesc')}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-base-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('recentActivity')}</h3>
        <div className="space-y-3">
          {stats.filter((stat) => stat.events.length > 0).length > 0 ? (
            stats
              .filter((stat) => stat.events.length > 0)
              .slice(0, 5)
              .map((stat) => {
                const quote = quotes.find((q) => q.documentId === stat.quoteId)
                return (
                  <div
                    key={stat.quoteId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{quote?.title || 'Orçamento'}</p>
                      <p className="text-sm text-gray-600">
                        {stat.totalViews} visualizações • {stat.totalDownloads} downloads
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {stat.lastViewed ? formatDate(stat.lastViewed) : 'Nunca visualizado'}
                      </p>
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Nenhuma atividade recente</p>
              <p className="text-sm">
                Os dados de tracking aparecerão aqui quando houver visualizações ou downloads
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
