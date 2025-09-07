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
      const messageKey = message.replace('quote.', '').replace('errors.', '')
      toast.success(t(messageKey))
      onSuccess?.()
    } else if (
      message.includes('Error') ||
      message.includes('error') ||
      message.includes('validationError') ||
      message.includes('unexpectedError')
    ) {
      const messageKey = message.replace('quote.', '').replace('errors.', '')
      toast.error(t(messageKey))
    }
  }, [message, onSuccess, t])
}
