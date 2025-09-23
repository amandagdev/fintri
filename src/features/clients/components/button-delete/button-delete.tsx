'use client'

import { useTransition } from 'react'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useTranslations } from 'next-intl'

import { deleteClientAction } from '../../actions'

export function DeleteButton({ clientId }: { clientId: string }) {
  const t = useTranslations('clients')
  const [isPending, startTransition] = useTransition()
  const modalId = `delete-client-modal-${clientId}`

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteClientAction(clientId)
        const modal = document.getElementById(modalId) as HTMLDialogElement
        modal?.close()

        if (result.success) {
          toast.success(t(result.message as never))
        } else {
          toast.error(t(result.message as never))
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
        aria-label={t('deleteButton')}
      >
        {isPending ? (
          <span className="loading loading-xs" role="status"></span>
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
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
              className="btn bg-primary text-white"
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
