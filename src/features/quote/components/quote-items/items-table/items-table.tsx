'use client'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { QuoteItem } from '@/features/quote/state'
import { formatCurrency } from '@/lib/utils'

interface QuoteItemsTableProps {
  readonly items: QuoteItem[]
  readonly onRemoveItem: (index: number) => void
}

export function QuoteItemsTable({ items, onRemoveItem }: QuoteItemsTableProps) {
  const t = useTranslations('quote')

  if (items.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-sm font-medium text-gray-600">{t('form.type')}</th>
            <th className="text-sm font-medium text-gray-600">{t('form.itemName')}</th>
            <th className="text-sm font-medium text-gray-600 text-center">{t('form.quantity')}</th>
            <th className="text-sm font-medium text-gray-600 text-right">{t('form.unitPrice')}</th>
            <th className="text-sm font-medium text-gray-600 text-right">{t('form.total')}</th>
            <th className="text-sm font-medium text-gray-600 text-center">{t('form.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.item_type}-${item.item_name}-${index}`} className="hover">
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
                <span className="text-sm text-gray-700">{formatCurrency(item.unit_price)}</span>
              </td>
              <td className="text-right">
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrency(item.total)}
                </span>
              </td>
              <td className="text-center">
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
