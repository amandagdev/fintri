'use client'

import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ formId }: { formId: string }) {
  const t = useTranslations('clients.form')
  const { pending } = useFormStatus()

  return (
    <button
      form={formId}
      type="submit"
      className="btn bg-[#1b6d71] hover:bg-[#2cb5a0] text-white"
      disabled={pending}
    >
      {pending ? <span className="loading loading-spinner"></span> : t('saveButton')}
    </button>
  )
}
