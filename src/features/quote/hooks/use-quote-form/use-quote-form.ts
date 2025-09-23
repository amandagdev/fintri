'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { Client } from '@/features/clients/types'
import type { Quote } from '@/features/quote/state'

interface UseQuoteFormProps {
  readonly data?: Quote
  readonly onSuccess?: () => void
  readonly clients?: Client[]
}

export function useQuoteForm({ data, onSuccess, clients: propClients }: UseQuoteFormProps = {}) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>(propClients || [])
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    data?.client?.id ? String(data.client.id) : undefined,
  )
  const [quoteType, setQuoteType] = useState<'simple' | 'detailed'>(data?.quote_type || 'simple')

  useEffect(() => {
    if (propClients) {
      setClients(propClients)
    }
  }, [propClients])

  useEffect(() => {
    if (data?.client?.id) {
      setSelectedClient(String(data.client.id))
    }
  }, [data?.client?.id])

  useEffect(() => {
    if (data) {
      if (data.items && data.items.length > 0) {
        setQuoteType('detailed')
      } else {
        setQuoteType('simple')
      }
    }
  }, [data])

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value)
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      router.push('/quote')
    }
  }

  return {
    clients,
    selectedClient,
    quoteType,
    setQuoteType,
    handleClientChange,
    handleSuccess,
  }
}
