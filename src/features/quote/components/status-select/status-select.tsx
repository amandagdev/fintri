'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { updateQuoteStatusAction } from '../../actions/actions'

interface StatusSelectProps {
  currentStatus: string
  quoteId: string
}

export function StatusSelect({ currentStatus, quoteId }: StatusSelectProps) {
  const t = useTranslations('quote')
  const [isLoading, setIsLoading] = useState(false)

  const getSelectClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'select select-bordered select-sm w-full max-w-xs bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'select select-bordered select-sm w-full max-w-xs bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'select select-bordered select-sm w-full max-w-xs bg-red-50 text-red-700 border-red-200'
      default:
        return 'select select-bordered select-sm w-full max-w-xs bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsLoading(true)
    try {
      const result = await updateQuoteStatusAction(quoteId, newStatus)
      if (result.message === 'quoteStatusUpdatedSuccessfully') {
        toast.success(t('quoteStatusUpdatedSuccessfully'))
      } else {
        toast.error(t('errors.unexpectedError'))
      }
    } catch {
      toast.error(t('errors.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <select
      className={getSelectClass(currentStatus)}
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isLoading}
    >
      <option value="pending">Pendente</option>
      <option value="accepted">Aprovado</option>
      <option value="rejected">Rejeitado</option>
    </select>
  )
}
