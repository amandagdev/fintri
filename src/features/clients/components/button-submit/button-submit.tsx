'use client'

import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ formId, buttonTextKey }: { formId: string; buttonTextKey: string }) {
  const t = useTranslations('clients')
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      form={formId}
      className="btn bg-[#1b6d71] hover:bg-[#2cb5a0] text-white"
      disabled={pending}
    >
      {pending ? <span className="loading loading-spinner"></span> : t(buttonTextKey as never)}
    </button>
  )
}
