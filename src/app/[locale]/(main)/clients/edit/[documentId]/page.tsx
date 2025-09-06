import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { EditClientForm } from '@/features/clients/components/client-edit/client-edit'
import { getClientByDocumentId } from '@/features/clients/services/service'

interface EditClientPageProps {
  params: Promise<{ documentId: string }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { documentId } = await params

  const t = await getTranslations('clients')
  const client = await getClientByDocumentId(documentId)

  if (!client) {
    notFound()
  }

  return (
    <main className="p-6 lg:p-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('editPageTitle')}</h1>
        <p className="text-gray-500 mt-1">
          {t('editPageDescription', { clientName: client.name })}
        </p>
      </header>

      <EditClientForm client={client} />
    </main>
  )
}
