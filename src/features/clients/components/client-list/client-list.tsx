'use client'

import { useEffect } from 'react'

import { Edit } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { Client } from '../../types'
import { DeleteButton } from '../button-delete/button-delete'

interface ClientListProps {
  clients: Client[]
}

export function ClientList({ clients }: ClientListProps) {
  const t = useTranslations('clients')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Extrair o locale do pathname
  const locale = pathname.split('/')[1] || 'pt'

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success(t('successMessage'))
      router.replace(pathname, { scroll: false })
    } else if (searchParams.get('updated') === 'true') {
      toast.success(t('updateSuccessMessage'))
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams, t, router, pathname])

  return (
    <>
      {clients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white">
            <thead>
              <tr>
                <th className="text-left">{t('tableHeaderName')}</th>
                <th className="text-left">{t('tableHeaderEmail')}</th>
                <th className="text-left">{t('tableHeaderPhone')}</th>
                <th className="text-center">{t('tableHeaderActions')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: Client) => (
                <tr key={client.id} className="hover cursor-pointer">
                  <td>
                    <div className="font-semibold text-base-content">{client.name}</div>
                  </td>
                  <td>
                    <span className="font-medium">{client.email}</span>
                  </td>
                  <td>
                    <span className="font-medium">{client.phone || '-'}</span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(`/${locale}/clients/edit/${client.documentId}`)}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('editButton')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <DeleteButton clientId={client.documentId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="hero min-h-[400px] bg-base-200 rounded-lg">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold">{t('emptyStateTitle')}</h3>
              <p className="py-6 text-base-content/70">{t('emptyStateDescription')}</p>
              <button
                className="btn text-white"
                style={{ backgroundColor: '#2cb5a1', borderColor: '#2cb5a1' }}
                onClick={() => router.push(`/${locale}/clients/add`)}
              >
                {t('addNewButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
