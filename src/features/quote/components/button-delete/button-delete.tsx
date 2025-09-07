'use client'

import { useTransition } from 'react'

import { Trash2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { deleteQuoteAction } from '@/features/quote/actions/actions'

interface DeleteQuoteButtonProps {
  readonly documentId: string
}

export function DeleteQuoteButton({ documentId }: DeleteQuoteButtonProps) {
  const t = useTranslations('quote')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const modalId = `delete-quote-modal-${documentId}`

  // Extrair o locale do pathname
  const locale = pathname.split('/')[1] || 'pt'

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteQuoteAction(documentId)
        const modal = document.getElementById(modalId) as HTMLDialogElement
        modal?.close()

        if (result.message?.includes('quoteDeletedSuccessfully')) {
          const messageKey = result.message.replace('errors.', '')
          toast.success(t(messageKey))
          router.push(`/${locale}/quote`)
        } else if (result.message?.includes('Error') || result.message?.includes('error')) {
          const messageKey = result.message.replace('errors.', '')
          toast.error(t(messageKey))
        }
      } catch {
        toast.error(t('deleteError'))
        const modal = document.getElementById(modalId) as HTMLDialogElement
        modal?.close()
      }
    })
  }

  const handleOpenModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    modal?.showModal()
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={isPending}
        className="btn btn-ghost btn-sm btn-square text-error"
        aria-label={t('delete')}
      >
        {isPending ? <span className="loading loading-xs"></span> : <Trash2 className="w-4 h-4" />}
      </button>

      <dialog id={modalId} className="modal">
        <div className="modal-box text-center">
          <h3 className="font-bold text-lg">{t('confirmDeleteTitle')}</h3>
          <p className="py-4">{t('confirmDeleteMessage')}</p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline" disabled={isPending}>
                {t('cancel')}
              </button>
            </form>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="btn bg-[#2cb5a0] text-white"
            >
              {isPending ? (
                <>
                  <span className="loading loading-xs"></span>
                  {t('confirmDelete')}
                </>
              ) : (
                t('confirmDelete')
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
