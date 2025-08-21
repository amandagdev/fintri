'use client'

import { useTransition } from 'react'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { deleteClientAction } from '../../actions'

export function DeleteButton({ clientId }: { clientId: string }) {
  const t = useTranslations('clients')
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteClientAction(clientId)

      if (result.success) {
        toast.success(t(result.message as never))
      } else {
        toast.error(t(result.message as never))
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-ghost btn-sm btn-square text-error"
      aria-label={t('deleteButton')}
    >
      {isPending ? (
        <span className="loading loading-xs" role="status"></span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
