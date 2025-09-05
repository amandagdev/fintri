'use client'

import { useActionState, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'

import Wrapper from '@/features/account/utils/wrapper'
import { getClients } from '@/features/clients/services/service'
import type { Client } from '@/features/clients/types'

import { initialState, type FieldErrors, type Quote } from '../../state'
import { SubmitButton } from '../quote-submit-button/quote-submit-button'

interface QuoteFormProps {
  readonly action: (
    prevState: { errors?: FieldErrors; message?: string },
    formData: FormData,
  ) => Promise<{ errors?: FieldErrors; message?: string }>
  readonly data?: Quote
}

export function QuoteForm({ action, data }: QuoteFormProps) {
  const t = useTranslations('quote')
  const router = useRouter()
  const [state, formAction] = useActionState(action, initialState)
  const { pending } = useFormStatus()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string | undefined>(data?.client?.id)

  // Função para obter a data atual no formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClients()
      setClients(fetchedClients)
    }
    fetchClients()
  }, [])

  useEffect(() => {
    if (data?.client?.id) {
      setSelectedClient(data.client.id)
    }
  }, [data?.client?.id])

  useEffect(() => {
    if (state.message?.includes('successfully')) {
      const timer = setTimeout(() => {
        router.push('/quote')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.message, router])

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value)
  }

  const buttonTextKey = data ? 'form.updateButton' : 'form.saveButton'
  const button = (
    <SubmitButton formId="quote-form" buttonTextKey={buttonTextKey} pending={pending} />
  )

  return (
    <Wrapper title="" footer={button}>
      <form id="quote-form" action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={data?.id} />
        <input
          type="hidden"
          name="client"
          value={
            selectedClient
              ? JSON.stringify({
                  id: selectedClient,
                  name: clients.find((client) => client.id === parseInt(selectedClient))?.name,
                })
              : ''
          }
        />
        <input
          type="hidden"
          name="notification"
          value={data?.notification?.id ? JSON.stringify({ id: data.notification.id }) : ''}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">{t('title')}</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder={t('titlePlaceholder')}
              className="input input-bordered w-full"
              defaultValue={data?.title}
            />
            {state.errors?.title && (
              <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="quote_send_date">
              <span className="label-text">{t('quote_send_date')}</span>
            </label>
            <input
              id="quote_send_date"
              name="quote_send_date"
              type="date"
              className="input input-bordered w-full"
              defaultValue={data?.quote_send_date || getCurrentDate()}
            />
            {state.errors?.quote_send_date && (
              <p className="text-red-500 text-sm mt-1">{state.errors.quote_send_date}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="quote_validate_date">
              <span className="label-text">{t('quote_validate_date')}</span>
            </label>
            <input
              id="quote_validate_date"
              name="quote_validate_date"
              type="date"
              className="input input-bordered w-full"
              defaultValue={data?.quote_validate_date}
            />
            {state.errors?.quote_validate_date && (
              <p className="text-red-500 text-sm mt-1">{state.errors.quote_validate_date}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="client">
              <span className="label-text">{t('client')}</span>
            </label>
            <select
              id="client"
              name="clientId"
              value={selectedClient || ''}
              onChange={handleClientChange}
              className="select select-bordered w-full"
            >
              <option value="">{t('selectClient')}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id.toString()}>
                  {client.name}
                </option>
              ))}
            </select>
            {state.errors?.client && (
              <p className="text-red-500 text-sm mt-1">{state.errors.client}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="total_value">
              <span className="label-text">{t('total_value')}</span>
            </label>
            <input
              id="total_value"
              name="total_value"
              type="number"
              step="0.01"
              placeholder="0,00"
              className="input input-bordered w-full"
              defaultValue={data?.total_value}
            />
            {state.errors?.total_value && (
              <p className="text-red-500 text-sm mt-1">{state.errors.total_value}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="discount">
              <span className="label-text">{t('discount')}</span>
            </label>
            <input
              id="discount"
              name="discount"
              type="number"
              step="0.01"
              placeholder="0,00"
              className="input input-bordered w-full"
              defaultValue={data?.discount}
            />
            {state.errors?.discount && (
              <p className="text-red-500 text-sm mt-1">{state.errors.discount}</p>
            )}
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">{t('description')}</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder={t('descriptionPlaceholder')}
            className="textarea textarea-bordered w-full"
            defaultValue={data?.description}
          />
          {state.errors?.description && (
            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="observations">
            <span className="label-text">{t('observations')}</span>
          </label>
          <textarea
            id="observations"
            name="observations"
            placeholder={t('observationsPlaceholder')}
            className="textarea textarea-bordered w-full"
            defaultValue={data?.observations}
          />
          {state.errors?.observations && (
            <p className="text-red-500 text-sm mt-1">{state.errors.observations}</p>
          )}
        </div>

        {state.message && <p className="text-green-500 text-sm mt-1">{state.message}</p>}
      </form>
    </Wrapper>
  )
}
