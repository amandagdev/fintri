'use client'

import { BarChart3, Calendar, FileText } from 'lucide-react'

import { useTranslations } from 'next-intl'

import type { Quote } from '@/features/quote/state'
import { formatCurrency } from '@/lib/utils'

import { useDashboardStats } from '../../hooks/use-dashboard-stats'

interface StatsCardsProps {
  readonly quotes: Quote[]
}

export function StatsCards({ quotes }: StatsCardsProps) {
  const t = useTranslations('dashboard.stats')
  const stats = useDashboardStats({ quotes })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-gray-800">
          <FileText className="w-8 h-8" />
        </div>
        <div className="stat-title text-gray-600">{t('totalQuotes')}</div>
        <div className="stat-value text-gray-800">{stats.totalQuotes}</div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-gray-800">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="stat-title text-gray-600">{t('currentMonthQuotes')}</div>
        <div className="stat-value text-gray-800">{stats.currentMonthQuotes}</div>
        <div className="stat-desc text-gray-500">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-title text-gray-600">{t('totalValue')}</div>
        <div className="stat-value text-gray-800">{formatCurrency(stats.totalAcceptedValue)}</div>
        <div className="stat-desc text-gray-500">{t('totalValueDesc')}</div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-gray-800">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="stat-title text-gray-600">{t('conversionRate')}</div>
        <div className="stat-value text-gray-800">{stats.conversionRate.toFixed(1)}%</div>
        <div className="stat-desc text-gray-500">{t('conversionRateDesc')}</div>
      </div>
    </div>
  )
}
