'use client'

import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const t = useTranslations('registerPage')
  const { pending } = useFormStatus()

  return (
    <button
      className="btn border-none text-lg bg-[#1b6d71] hover:bg-[#155a5e] text-white"
      type="submit"
      disabled={pending}
    >
      {pending ? t('registering') : t('registerButton')}
    </button>
  )
}
