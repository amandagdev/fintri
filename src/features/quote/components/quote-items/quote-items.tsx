'use client'

import { useTranslations } from 'next-intl'

import { QuoteItemForm } from './quote-item-form'
import { QuoteItemsTable } from './quote-items-table'
import type { QuoteItem } from '../../state'

interface QuoteItemsProps {
  readonly items: QuoteItem[]
  readonly onChange: (items: QuoteItem[]) => void
}

export function QuoteItems({ items, onChange }: QuoteItemsProps) {
  const t = useTranslations('quote')

  const handleAddItem = (item: QuoteItem) => {
    onChange([...items, item])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{t('form.items')}</h3>
      </div>

      <QuoteItemForm onAddItem={handleAddItem} />

      <QuoteItemsTable items={items} onRemoveItem={handleRemoveItem} />
    </div>
  )
}
