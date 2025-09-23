'use client'

import { useTranslations } from 'next-intl'

export function SubmitButtonModal({ buttonTextKey }: { buttonTextKey: string }) {
  const t = useTranslations('clients')

  return (
    <button type="submit" className="btn bg-primary hover:bg-primary-dark text-white">
      {t(buttonTextKey as never)}
    </button>
  )
}
