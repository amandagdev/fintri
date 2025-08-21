'use client'

import { useEffect } from 'react'

import { Edit } from 'lucide-react'
import Link from 'next/link'
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
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table">
            <thead>
              <tr className="border-b-gray-200">
                <th>{t('tableHeaderName')}</th>
                <th>{t('tableHeaderEmail')}</th>
                <th>{t('tableHeaderPhone')}</th>
                <th className="text-right">{t('tableHeaderActions')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: Client) => (
                <tr key={client.id} className="hover">
                  <td>
                    <div className="font-bold">{client.name}</div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.phone || '-'}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/clients/edit/${client.documentId}`}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('editButton')}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton clientId={client.documentId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">{t('emptyStateTitle')}</h3>
          <p className="mt-2 text-gray-500">{t('emptyStateDescription')}</p>
        </div>
      )}
    </>
  )
}
