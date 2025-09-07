'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { getClients } from '@/features/clients/services/service'
import type { Client } from '@/features/clients/types'

import type { Quote } from '../state'

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

  // Extrair o locale do pathname
  const locale = pathname.split('/')[1] || 'pt'

  // Carregar clientes
  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClients()
      setClients(fetchedClients)
    }
    fetchClients()
  }, [])

  // Atualizar cliente selecionado quando data mudar
  useEffect(() => {
    if (data?.client?.id) {
      setSelectedClient(String(data.client.id))
    }
  }, [data?.client?.id])

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
    // Estados
    clients,
    selectedClient,
    quoteType,

    // Setters
    setQuoteType,

    // Handlers
    handleClientChange,
    handleSuccess,
  }
}
