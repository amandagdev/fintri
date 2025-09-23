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
      className="btn bg-primary text-white w-full"
      disabled={pending}
    >
      {pending ? <span className="loading loading-spinner loading-sm"></span> : t(buttonTextKey)}
    </button>
  )
}
