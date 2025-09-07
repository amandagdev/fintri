import { useEffect } from 'react'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface UseQuoteToastProps {
  message?: string
  onSuccess?: () => void
}

export function useQuoteToast({ message, onSuccess }: UseQuoteToastProps) {
  const t = useTranslations('quote')

  useEffect(() => {
    if (!message) return

    if (
      message.includes('quoteCreatedSuccessfully') ||
      message.includes('quoteUpdatedSuccessfully')
    ) {
      toast.success(t(message))
      onSuccess?.()

      return
    }

    if (
      message.includes('Error') ||
      message.includes('error') ||
      message.includes('validationError') ||
      message.includes('unexpectedError')
    ) {
      toast.error(t('errors.' + message))
    }
  }, [message, onSuccess, t])
}
