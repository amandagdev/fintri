'use client'

import { useTranslations } from 'next-intl'

interface SubmitButtonProps {
  readonly formId: string
  readonly buttonTextKey: string
  readonly pending: boolean
}

export function SubmitButton({ formId, buttonTextKey, pending }: SubmitButtonProps) {
  const t = useTranslations('quote')
  return (
    <button
      type="submit"
      form={formId}
      className="btn bg-[#1b6d71] text-white w-full"
      aria-disabled={pending}
    >
      {pending ? t('loading') : t(buttonTextKey)}
    </button>
  )
}
