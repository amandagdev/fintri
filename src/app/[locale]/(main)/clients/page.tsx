import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { getClients } from '@/features/clients/services/service'

import { ClientsPageClient } from './clients-page-client'

export default async function ClientsPage() {
  const t = await getTranslations('clients')
  const clients = await getClients()

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('listTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('listDescription')}</p>
        </div>
        <Link
          href="/clients/add"
          className="btn text-white"
          style={{ backgroundColor: '#2cb5a1', borderColor: '#2cb5a1' }}
        >
          <Plus className="w-4 h-4" />
          {t('addNewButton')}
        </Link>
      </header>

      <ClientsPageClient clients={clients} />
    </main>
  )
}
