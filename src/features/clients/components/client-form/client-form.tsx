'use client'

import { useTranslations } from 'next-intl'

import Wrapper from '@/features/account/utils/wrapper'

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

  console.log('ClientForm state:', state)

  const buttonTextKey = initialData ? 'form.updateButton' : 'form.saveButton'
  const button = <SubmitButton formId="client-form" buttonTextKey={buttonTextKey} />

  return (
    <Wrapper title="" footer={button}>
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
              defaultValue={initialData?.name || ''}
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
              defaultValue={initialData?.email || ''}
            />
            {state.errors?.email && (
              <p className="text-red-500 text-sm mt-1">{t(state.errors.email as never)}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="phone">
              <span className="label-text">{t('form.phoneLabel')}</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t('form.phonePlaceholder')}
              className="input input-bordered w-full"
              defaultValue={initialData?.phone || ''}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="cpf_or_cnpj">
              <span className="label-text">{t('form.taxIdLabel')}</span>
            </label>
            <input
              id="cpf_or_cnpj"
              name="cpf_or_cnpj"
              type="text"
              placeholder={t('form.taxIdPlaceholder')}
              className="input input-bordered w-full"
              defaultValue={initialData?.cpf_or_cnpj || ''}
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
            defaultValue={initialData?.address || ''}
          />
        </div>

        {state.message && (
          <p className="text-red-500 text-center mt-4">{t(state.message as never)}</p>
        )}
      </form>
    </Wrapper>
  )
}
