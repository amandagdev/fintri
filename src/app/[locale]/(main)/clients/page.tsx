import Link from 'next/link'

import { Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { getClients } from '@/features/clients/services/service'

import { ClientsPageClient } from './clients-page-client'

export default async function ClientsPage() {
  const t = await getTranslations('clients')
  const clients = await getClients()

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('listTitle')}</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('listDescription')}</p>
        </div>
        <Link
          href="/clients/add"
          className="btn btn-primary text-white w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          {t('addNewButton')}
        </Link>
      </header>

      <ClientsPageClient clients={clients} />
    </main>
  )
}
