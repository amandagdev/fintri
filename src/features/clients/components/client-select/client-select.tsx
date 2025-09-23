'use client'

import { useState } from 'react'

import { createPortal } from 'react-dom'

import { Plus } from 'lucide-react'

import { useTranslations } from 'next-intl'

import type { Client } from '../../types'
import { ClientCreateModal } from '../client-create-modal/client-create-modal'

interface ClientSelectProps {
  readonly clients: Client[]
  readonly selectedClient: string | undefined
  readonly onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  readonly errors?: { client?: string }
}

export function ClientSelect({
  clients,
  selectedClient,
  onClientChange,
  errors,
}: ClientSelectProps) {
  const t = useTranslations('quote')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clientsList, setClientsList] = useState(clients)

  const handleClientCreated = (newClient: { id: string; name: string }) => {
    const clientToAdd: Client = {
      id: parseInt(newClient.id),
      name: newClient.name,
      email: '',
      phone: '',
      cpf_or_cnpj: '',
      documentId: '',
    }

    setClientsList((prev) => [...prev, clientToAdd])

    const event = {
      target: { value: newClient.id },
    } as React.ChangeEvent<HTMLSelectElement>
    onClientChange(event)
  }

  return (
    <>
      <div className="form-control">
        <label className="label" htmlFor="client">
          <span className="label-text">{t('client')}</span>
        </label>
        <div className="flex gap-2">
          <select
            id="client"
            name="clientId"
            value={selectedClient || ''}
            onChange={onClientChange}
            className="select select-bordered w-full"
          >
            <option value="">{t('selectClient')}</option>
            {clientsList.map((client) => (
              <option key={client.id} value={client.id.toString()}>
                {client.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-outline btn-square"
            title="Adicionar Cliente"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {errors?.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
      </div>

      {isModalOpen &&
        createPortal(
          <ClientCreateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onClientCreated={handleClientCreated}
          />,
          document.body,
        )}
    </>
  )
}
