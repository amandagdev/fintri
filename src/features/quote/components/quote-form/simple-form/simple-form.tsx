import React from 'react'

import { useTranslations } from 'next-intl'

import type { FieldErrors, Quote } from '@/features/quote/state'
import { formatDateForInput, getCurrentDate } from '@/lib/utils'

interface QuoteSimpleFormProps {
  readonly data?: Quote
  readonly errors?: FieldErrors
  readonly clients: Array<{ id: number; name: string }>
  readonly selectedClient: string
  readonly onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function QuoteSimpleForm({
  data,
  errors,
  clients,
  selectedClient,
  onClientChange,
}: QuoteSimpleFormProps) {
  const t = useTranslations('quote')

  return (
    <>
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
          {errors?.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
          {errors?.quote_send_date && (
            <p className="text-red-500 text-sm mt-1">{errors.quote_send_date}</p>
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
          {errors?.quote_validate_date && (
            <p className="text-red-500 text-sm mt-1">{errors.quote_validate_date}</p>
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
            onChange={onClientChange}
            className="select select-bordered w-full"
          >
            <option value="">{t('selectClient')}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id.toString()}>
                {client.name}
              </option>
            ))}
          </select>
          {errors?.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
        </div>
      </div>

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
            className="input input-bordered w-full"
            defaultValue={data?.total_value}
          />
          {errors?.total_value && <p className="text-red-500 text-sm mt-1">{errors.total_value}</p>}
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
          {errors?.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
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
        {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
        {errors?.observations && <p className="text-red-500 text-sm mt-1">{errors.observations}</p>}
      </div>
    </>
  )
}
