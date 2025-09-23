'use client'

import { BarChart3, DollarSign, Users } from 'lucide-react'

import type { Quote } from '@/features/quote/state'
import { formatCurrency } from '@/lib/utils'

import { useDashboardStats } from '../../hooks/use-dashboard-stats'

interface StatsCardsProps {
  readonly quotes: Quote[]
}

export function StatsCards({ quotes }: StatsCardsProps) {
  const stats = useDashboardStats({ quotes })

  const acceptedQuotes = quotes.filter((quote) => quote.status_quote === 'accepted')
  const pendingQuotes = quotes.filter((quote) => quote.status_quote === 'pending')
  const rejectedQuotes = quotes.filter((quote) => quote.status_quote === 'rejected')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Orçamentos</h3>
              <p className="text-sm text-gray-500">Atividade de Orçamentos</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total de Orçamentos</span>
            <span className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Este Mês</span>
            <span className="text-2xl font-bold text-gray-900">{stats.currentMonthQuotes}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taxa de Conversão</span>
            <span className="text-2xl font-bold text-gray-900">
              {stats.conversionRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <p className="text-sm text-gray-500">Distribuição de Status</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Aceitos</span>
            <span className="text-2xl font-bold text-green-600">{acceptedQuotes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pendentes</span>
            <span className="text-2xl font-bold text-yellow-600">{pendingQuotes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Rejeitados</span>
            <span className="text-2xl font-bold text-red-600">{rejectedQuotes.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-primary rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Valor Total Faturado</h3>
            <p className="text-sm opacity-80">Últimos 12 Meses</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-bold mb-2">{formatCurrency(stats.totalAcceptedValue)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div>
            <div className="text-sm opacity-80">Pendentes</div>
            <div className="text-xl font-semibold">
              {formatCurrency(
                pendingQuotes.reduce((sum, quote) => sum + (quote.total_value || 0), 0),
              )}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-80">Este Mês</div>
            <div className="text-xl font-semibold">
              {formatCurrency(
                stats.currentMonthQuotes > 0
                  ? stats.totalAcceptedValue / (stats.currentMonthQuotes || 1)
                  : 0,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
