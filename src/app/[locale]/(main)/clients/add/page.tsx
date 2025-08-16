'use client'

import { useActionState } from 'react'

import { useTranslations } from 'next-intl'

import { addClientAction } from '@/features/clients/actions'
import { ClientForm } from '@/features/clients/components/client-form/client-form'
import { initialState } from '@/features/clients/state'

export default function AddClientPage() {
  const t = useTranslations('clients')
  const [state, formAction] = useActionState(addClientAction, initialState)

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('addPageTitle')}</h1>
        <p className="text-gray-500 mt-1">{t('addPageDescription')}</p>
      </header>

      <ClientForm action={formAction} state={state} />
    </main>
  )
}
