'use client'

import { useEffect, useState } from 'react'

import { IMaskInput } from 'react-imask'

import { useTranslations } from 'next-intl'

import type { State } from '../../actions'
import type { ClientFormData } from '../../types'
import { SubmitButton } from '../button-submit/button-submit'

interface AddClientFormProps {
  action: (formData: FormData) => void
  state: State
  initialData?: ClientFormData
}

export function ClientForm({ action, state, initialData }: AddClientFormProps) {
  const t = useTranslations('clients')

  const [formValues, setFormValues] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    cpf_or_cnpj: initialData?.cpf_or_cnpj || '',
    address: initialData?.address || '',
  })

  useEffect(() => {
    if (state.success) {
      setFormValues({
        name: '',
        email: '',
        phone: '',
        cpf_or_cnpj: '',
        address: '',
      })
    }
  }, [state.success])

  const buttonTextKey = initialData ? 'form.updateButton' : 'form.saveButton'
  const button = <SubmitButton formId="client-form" buttonTextKey={buttonTextKey} />

  return (
    <div className="space-y-6">
      <form id="client-form" action={action} className="space-y-6">
        {initialData?.documentId && (
          <input type="hidden" name="documentId" defaultValue={initialData.documentId} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">{t('form.fullNameLabel')}</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t('form.fullNamePlaceholder')}
              className="input input-bordered w-full"
              required
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
            />
            {state.errors?.name && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.name as never)}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">{t('form.emailLabel')}</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t('form.emailPlaceholder')}
              className="input input-bordered w-full"
              required
              value={formValues.email}
              onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
            />
            {state.errors?.email && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.email as never)}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="phone">
              <span className="label-text">{t('form.phoneLabel')}</span>
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              id="phone"
              name="phone"
              type="tel"
              placeholder={t('form.phonePlaceholder')}
              className="input input-bordered w-full"
              value={formValues.phone}
              onAccept={(value) => setFormValues((prev) => ({ ...prev, phone: value || '' }))}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="cpf_or_cnpj">
              <span className="label-text">{t('form.taxIdLabel')}</span>
            </label>
            <IMaskInput
              mask={[{ mask: '000.000.000-00' }, { mask: '00.000.000/0000-00' }]}
              id="cpf_or_cnpj"
              name="cpf_or_cnpj"
              type="text"
              placeholder={t('form.taxIdPlaceholder')}
              className="input input-bordered w-full"
              value={formValues.cpf_or_cnpj}
              onAccept={(value) => setFormValues((prev) => ({ ...prev, cpf_or_cnpj: value || '' }))}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="address">
            <span className="label-text">{t('form.addressLabel')}</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder={t('form.addressPlaceholder')}
            className="input input-bordered w-full"
            value={formValues.address}
            onChange={(e) => setFormValues((prev) => ({ ...prev, address: e.target.value }))}
          />
        </div>
      </form>

      <div className="flex justify-end">{button}</div>
    </div>
  )
}
