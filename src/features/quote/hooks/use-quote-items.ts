'use client'

import { useState } from 'react'

import type { QuoteItem } from '../state'

interface UseQuoteItemsProps {
  readonly initialItems?: QuoteItem[]
}

export function useQuoteItems({ initialItems = [] }: UseQuoteItemsProps = {}) {
  const [items, setItems] = useState<QuoteItem[]>(initialItems)

  const addItem = (newItem: Omit<QuoteItem, 'total'>) => {
    if (newItem.item_name && newItem.quantity && newItem.unit_price) {
      const total = (newItem.quantity || 0) * (newItem.unit_price || 0)

      const item: QuoteItem = {
        item_type: newItem.item_type || 'service',
        item_name: newItem.item_name,
        quantity: newItem.quantity,
        unit_price: newItem.unit_price,
        total,
      }

      setItems((prevItems) => [...prevItems, item])
    }
  }

  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const resetItems = () => {
    setItems([])
  }

  const setItemsFromData = (newItems: QuoteItem[]) => {
    setItems(newItems)
  }

  return {
    items,
    addItem,
    removeItem,
    getTotal,
    resetItems,
    setItemsFromData,
  }
}
