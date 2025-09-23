'use client'

import { useFormStatus } from 'react-dom'

import { useTranslations } from 'next-intl'

export function SubmitButton() {
  const t = useTranslations('registerPage')
  const { pending } = useFormStatus()

  return (
    <button
      className="btn border-none text-lg bg-primary hover:bg-primary-dark text-white"
      type="submit"
      disabled={pending}
    >
      {pending ? t('registering') : t('registerButton')}
    </button>
  )
}
