'use client'

import { useFormStatus } from 'react-dom'

import { useTranslations } from 'next-intl'

interface SubmitButtonProps {
  textKey: string
}

export function SubmitButton({ textKey }: SubmitButtonProps) {
  const t = useTranslations('account')
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="btn bg-primary text-white hover:bg-primary/90"
      disabled={pending}
    >
      {pending ? <span className="loading loading-spinner loading-sm"></span> : t(textKey)}
    </button>
  )
}
