'use client'

import { useActionState, useState } from 'react'

import { useFormStatus } from 'react-dom'

import Wrapper from '@/features/account/utils/wrapper'

import { QuoteDetailedForm } from './detailed-form'
import { QuoteSimpleForm } from './simple-form'
import { useQuoteCalculations } from '../../hooks/use-quote-calculations'
import { useQuoteForm } from '../../hooks/use-quote-form'
import { useQuoteToast } from '../../hooks/use-quote-toast'
import { initialState, type FieldErrors, type Quote, type QuoteItem } from '../../state'
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
  const [state, formAction] = useActionState(action, propState || initialState)
  const { pending } = useFormStatus()

  const { clients, selectedClient, quoteType, setQuoteType, handleClientChange, handleSuccess } =
    useQuoteForm({ data })

  const [items, setItems] = useState<QuoteItem[]>(data?.items || [])

  useQuoteToast({ message: state.message, onSuccess: handleSuccess })

  const { handleDiscountChange } = useQuoteCalculations({ items, quoteType })

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

        <div className="mb-6">
          <QuoteTypeSelector value={quoteType} onChange={setQuoteType} disabled={!!data} />
        </div>

        {quoteType === 'simple' ? (
          <QuoteSimpleForm
            data={data}
            errors={state.errors}
            clients={clients}
            selectedClient={selectedClient || ''}
            onClientChange={handleClientChange}
          />
        ) : (
          <QuoteDetailedForm
            data={data}
            errors={state.errors}
            clients={clients}
            selectedClient={selectedClient || ''}
            onClientChange={handleClientChange}
            items={items}
            onItemsChange={setItems}
            onDiscountChange={handleDiscountChange}
          />
        )}

        {state.message && <p className="text-green-500 text-sm mt-1">{state.message}</p>}
      </form>
    </Wrapper>
  )
}
