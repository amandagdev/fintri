'use client'

import { useActionState } from 'react'

import { X } from 'lucide-react'
import { toast } from 'sonner'

import { useTranslations } from 'next-intl'

import { addClientAction, type State } from '../../actions'
import { ClientFormModal } from '../client-form-modal/client-form-modal'

interface ClientCreateModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onClientCreated: (client: { id: string; name: string }) => void
}

export function ClientCreateModal({ isOpen, onClose, onClientCreated }: ClientCreateModalProps) {
  const t = useTranslations('clients')
  const [state, formAction] = useActionState(addClientAction, {} as State)

  const handleSuccess = (client: { id: string; name: string }) => {
    toast.success(t('clientCreatedSuccessfully'))
    onClientCreated(client)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{t('addNewButton')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-white">
          <ClientFormModal action={formAction} state={state} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}
