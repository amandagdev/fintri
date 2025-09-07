'use client'

import { BarChart3, Calendar, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Quote } from '@/features/quote/state'
import { formatCurrency } from '@/lib/utils'

import { useDashboardStats } from '../../hooks/use-dashboard-stats'

interface StatsCardsProps {
  quotes: Quote[]
}

export function StatsCards({ quotes }: StatsCardsProps) {
  const t = useTranslations('dashboard.stats')
  const stats = useDashboardStats({ quotes })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-warning">
          <FileText className="w-8 h-8" />
        </div>
        <div className="stat-title">{t('totalQuotes')}</div>
        <div className="stat-value text-warning">{stats.totalQuotes}</div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-info">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="stat-title">{t('currentMonthQuotes')}</div>
        <div className="stat-value text-info">{stats.currentMonthQuotes}</div>
        <div className="stat-desc">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-title">{t('totalValue')}</div>
        <div className="stat-value text-emerald-800">
          {formatCurrency(stats.totalAcceptedValue)}
        </div>
        <div className="stat-desc">{t('totalValueDesc')}</div>
      </div>

      <div className="stat bg-white rounded-lg shadow-sm border border-base-200">
        <div className="stat-figure text-purple-800">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="stat-title">{t('conversionRate')}</div>
        <div className="stat-value text-purple-800">{stats.conversionRate.toFixed(1)}%</div>
        <div className="stat-desc">{t('conversionRateDesc')}</div>
      </div>
    </div>
  )
}
