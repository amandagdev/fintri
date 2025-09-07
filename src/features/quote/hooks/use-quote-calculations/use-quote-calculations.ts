import { useEffect } from 'react'

import type { QuoteItem } from '@/features/quote/state'

interface UseQuoteCalculationsProps {
  items: QuoteItem[]
  quoteType: 'simple' | 'detailed'
}

export function useQuoteCalculations({ items, quoteType }: UseQuoteCalculationsProps) {
  useEffect(() => {
    if (quoteType !== 'detailed') return

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discountInput = document.getElementById('discount') as HTMLInputElement
    const discount = discountInput ? parseFloat(discountInput.value) || 0 : 0
    const total = subtotal - discount

    const totalInput = document.getElementById('total_value') as HTMLInputElement
    if (totalInput) {
      totalInput.value = total.toString()
    }
  }, [items, quoteType])

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quoteType !== 'detailed') return

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = parseFloat(e.target.value) || 0
    const total = subtotal - discount

    const totalInput = document.getElementById('total_value') as HTMLInputElement
    if (totalInput) {
      totalInput.value = total.toString()
    }
  }

  return { handleDiscountChange }
}
