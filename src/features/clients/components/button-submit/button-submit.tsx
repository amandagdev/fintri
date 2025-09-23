'use client'

import { useFormStatus } from 'react-dom'

import { useTranslations } from 'next-intl'

export function SubmitButton({ formId, buttonTextKey }: { formId: string; buttonTextKey: string }) {
  const t = useTranslations('clients')
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      form={formId}
      className="btn bg-primary hover:bg-primary-dark text-white"
      disabled={pending}
    >
      {pending ? (
        <span className="loading loading-spinner" role="status"></span>
      ) : (
        t(buttonTextKey as never)
      )}
    </button>
  )
}
