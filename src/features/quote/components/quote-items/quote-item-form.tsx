'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { QuoteItem } from '../../state'

interface QuoteItemFormProps {
  readonly onAddItem: (item: QuoteItem) => void
}

export function QuoteItemForm({ onAddItem }: QuoteItemFormProps) {
  const t = useTranslations('quote')

  const [newItem, setNewItem] = useState<Partial<QuoteItem>>({
    item_type: 'service',
    item_name: '',
    quantity: undefined,
    unit_price: undefined,
    total: 0,
  })

  const handleAddItem = () => {
    if (newItem.item_name && newItem.quantity && newItem.unit_price) {
      const total = (newItem.quantity || 0) * (newItem.unit_price || 0)

      const item: QuoteItem = {
        item_type: newItem.item_type || 'service',
        item_name: newItem.item_name,
        quantity: newItem.quantity,
        unit_price: newItem.unit_price,
        total,
      }

      onAddItem(item)

      setNewItem({
        item_type: 'service',
        item_name: '',
        quantity: undefined,
        unit_price: undefined,
        total: 0,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="label">
          <span className="label-text text-sm">{t('form.type')}</span>
        </label>
        <select
          value={newItem.item_type || 'service'}
          onChange={(e) =>
            setNewItem({ ...newItem, item_type: e.target.value as 'service' | 'product' })
          }
          className="select select-bordered select-sm w-full"
        >
          <option value="service">{t('form.service')}</option>
          <option value="product">{t('form.product')}</option>
        </select>
      </div>

      <div>
        <label className="label">
          <span className="label-text text-sm">{t('form.itemName')}</span>
        </label>
        <input
          type="text"
          value={newItem.item_name || ''}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          placeholder={t('form.itemNamePlaceholder')}
          className="input input-bordered input-sm w-full"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text text-sm">{t('form.quantity')}</span>
        </label>
        <input
          type="number"
          min="1"
          value={newItem.quantity || ''}
          onChange={(e) => {
            const value = e.target.value
            const quantity = value === '' ? undefined : parseInt(value) || undefined
            const unitPrice = newItem.unit_price || 0
            setNewItem({
              ...newItem,
              quantity,
              total: (quantity || 0) * unitPrice,
            })
          }}
          className="input input-bordered input-sm w-full"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text text-sm">{t('form.unitPrice')}</span>
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={newItem.unit_price || ''}
          onChange={(e) => {
            const value = e.target.value
            const unitPrice = value === '' ? undefined : parseFloat(value) || undefined
            const quantity = newItem.quantity || 0
            setNewItem({
              ...newItem,
              unit_price: unitPrice,
              total: quantity * (unitPrice || 0),
            })
          }}
          className="input input-bordered input-sm w-full"
        />
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={handleAddItem}
          disabled={!newItem.item_name || !newItem.quantity || !newItem.unit_price}
          className="btn bg-[#2cb5a0] hover:bg-[#155d61] text-white btn-sm w-full border-none disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {t('form.add')}
        </button>
      </div>
    </div>
  )
}
