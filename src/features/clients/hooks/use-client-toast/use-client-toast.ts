import { useEffect } from 'react'

import { toast } from 'sonner'

import { useTranslations } from 'next-intl'

interface UseClientToastProps {
  message?: string
  onSuccess?: () => void
}

export function useClientToast({ message, onSuccess }: UseClientToastProps) {
  const t = useTranslations('clients')

  useEffect(() => {
    if (!message) return

    if (
      message.includes('clientCreatedSuccessfully') ||
      message.includes('clientUpdatedSuccessfully')
    ) {
      toast.success(t(message))
      onSuccess?.()

      return
    }

    if (
      message.includes('Error') ||
      message.includes('error') ||
      message.includes('validationError') ||
      message.includes('unexpectedError') ||
      message.includes('failedToProcessClientData')
    ) {
      toast.error(t('errors.' + message))
    }
  }, [message, onSuccess, t])
}
