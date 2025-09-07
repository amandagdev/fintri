'use client'

import { useActionState, useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import Wrapper from '@/features/account/utils/wrapper'
import { formatDateForInput, getCurrentDate } from '@/lib/utils'

import { useQuoteForm } from '../../hooks/use-quote-form'
import { initialState, type FieldErrors, type Quote, type QuoteItem } from '../../state'
import { QuoteItems } from '../quote-items/quote-items'
import { SubmitButton } from '../quote-submit-button/quote-submit-button'
import { QuoteTypeSelector } from '../quote-type-selector/quote-type-selector'

interface QuoteFormProps {
  readonly action: (
    prevState: { errors?: FieldErrors; message?: string },
    formData: FormData,
  ) => Promise<{ errors?: FieldErrors; message?: string }>
  readonly state?: { errors?: FieldErrors; message?: string }
  readonly data?: Quote
}

export function QuoteForm({ action, state: propState, data }: QuoteFormProps) {
  const t = useTranslations('quote')
  const [state, formAction] = useActionState(action, propState || initialState)
  const { pending } = useFormStatus()

  const { clients, selectedClient, quoteType, setQuoteType, handleClientChange, handleSuccess } =
    useQuoteForm({ data })

  const [items, setItems] = useState<QuoteItem[]>(data?.items || [])

  useEffect(() => {
    if (
      state.message?.includes('quoteCreatedSuccessfully') ||
      state.message?.includes('quoteUpdatedSuccessfully')
    ) {
      const messageKey = state.message.replace('quote.', '').replace('errors.', '')
      toast.success(t(messageKey))
      handleSuccess()
    } else if (
      state.message?.includes('Error') ||
      state.message?.includes('error') ||
      state.message?.includes('validationError') ||
      state.message?.includes('unexpectedError')
    ) {
      const messageKey = state.message.replace('quote.', '').replace('errors.', '')
      toast.error(t(messageKey))
    }
  }, [state.message, handleSuccess, t])

  // Calcular total automaticamente quando itens mudarem
  useEffect(() => {
    if (quoteType === 'detailed') {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0)
      const discountInput = document.getElementById('discount') as HTMLInputElement
      const discount = discountInput ? parseFloat(discountInput.value) || 0 : 0
      const total = subtotal - discount

      const totalInput = document.getElementById('total_value') as HTMLInputElement
      if (totalInput) {
        totalInput.value = total.toString()
      }
    }
  }, [items, quoteType])

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quoteType === 'detailed') {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0)
      const discount = parseFloat(e.target.value) || 0
      const total = subtotal - discount

      const totalInput = document.getElementById('total_value') as HTMLInputElement
      if (totalInput) {
        totalInput.value = total.toString()
      }
    }
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
        <input type="hidden" name="quote_type" value={quoteType} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        {/* Seletor de tipo de orçamento */}
        <div className="mb-6">
          <QuoteTypeSelector value={quoteType} onChange={setQuoteType} />
        </div>

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
              className={`input input-bordered w-full ${quoteType === 'detailed' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              defaultValue={data?.title}
              readOnly={quoteType === 'detailed'}
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
              defaultValue={formatDateForInput(data?.quote_send_date) || getCurrentDate()}
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
              defaultValue={formatDateForInput(data?.quote_validate_date)}
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
        </div>

        {/* Componente de itens para orçamento detalhado */}
        {quoteType === 'detailed' && (
          <div className="mb-6">
            <QuoteItems items={items} onChange={setItems} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className={`input input-bordered w-full ${quoteType === 'detailed' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              defaultValue={data?.total_value}
              readOnly={quoteType === 'detailed'}
            />
            {quoteType === 'detailed' && (
              <p className="text-xs text-gray-500 mt-1">
                Valor calculado automaticamente baseado nos itens e desconto
              </p>
            )}
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
              onChange={handleDiscountChange}
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
