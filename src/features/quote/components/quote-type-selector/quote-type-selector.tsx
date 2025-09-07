'use client'

import { useTranslations } from 'next-intl'

interface QuoteTypeSelectorProps {
  readonly value: 'simple' | 'detailed'
  readonly onChange: (value: 'simple' | 'detailed') => void
}

export function QuoteTypeSelector({ value, onChange }: QuoteTypeSelectorProps) {
  const t = useTranslations('quote')

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{t('form.quoteType')}</span>
      </label>
      <div className="flex gap-4 mt-4">
        <label className="label cursor-pointer">
          <input
            type="radio"
            name="quote_type"
            value="simple"
            checked={value === 'simple'}
            onChange={(e) => onChange(e.target.value as 'simple' | 'detailed')}
            className="radio"
          />
          <span className="label-text ml-2">{t('form.simpleQuote')}</span>
        </label>
        <label className="label cursor-pointer">
          <input
            type="radio"
            name="quote_type"
            value="detailed"
            checked={value === 'detailed'}
            onChange={(e) => onChange(e.target.value as 'simple' | 'detailed')}
            className="radio"
          />
          <span className="label-text ml-2">{t('form.detailedQuote')}</span>
        </label>
      </div>
    </div>
  )
}
