'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { getClientsClient } from '@/features/clients/services/client-service'
import type { Client } from '@/features/clients/types'
import type { Quote } from '@/features/quote/state'

interface UseQuoteFormProps {
  readonly data?: Quote
  readonly onSuccess?: () => void
}

export function useQuoteForm({ data, onSuccess }: UseQuoteFormProps = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    data?.client?.id ? String(data.client.id) : undefined,
  )
  const [quoteType, setQuoteType] = useState<'simple' | 'detailed'>(data?.quote_type || 'simple')

  const locale = pathname.split('/')[1] || 'pt'

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClientsClient()
      setClients(fetchedClients)
    }
    fetchClients()
  }, [])

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
      router.push(`/${locale}/quote`)
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
