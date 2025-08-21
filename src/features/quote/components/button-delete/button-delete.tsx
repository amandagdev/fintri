'use client'

import { useTransition } from 'react'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { deleteQuoteAction } from '@/features/quote/actions'

interface DeleteQuoteButtonProps {
  readonly id: string
}

export function DeleteQuoteButton({ id }: DeleteQuoteButtonProps) {
  const t = useTranslations('quote')
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteQuoteAction(id)

      if (result.message === 'deleted=true') {
        toast.success(t('deleteSuccessMessage'))
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
      aria-label={t('delete')}
    >
      {isPending ? <span className="loading loading-xs"></span> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
