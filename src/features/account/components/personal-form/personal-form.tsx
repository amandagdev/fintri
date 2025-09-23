'use client'

import { useActionState, useEffect, useState } from 'react'

import { IMaskInput } from 'react-imask'
import { toast } from 'sonner'

import { useTranslations } from 'next-intl'

import { updatePersonalDataAction } from '../../actions'
import Wrapper from '../../utils/wrapper'

interface PersonalFormProps {
  readonly user?: {
    username?: string
    phone?: string
    cpf?: string
    email?: string
  }
}

export default function PersonalForm({ user }: PersonalFormProps) {
  const t = useTranslations('account')
  const [state, formAction] = useActionState(updatePersonalDataAction, {})
  const [formValues, setFormValues] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
  })
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (state.message && typeof state.message === 'string') {
      if (state.message.includes('success')) {
        toast.success(t(state.message))
        setFormKey((prev) => prev + 1)
      } else {
        toast.error(t(state.message))
      }
    }
  }, [state.message, t])

  return (
    <Wrapper title={t('personalForm.title')} description={t('personalForm.description')}>
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label" htmlFor="fullName">
              <span className="label-text">{t('personalForm.fullNameLabel')}</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formValues.username}
              onChange={(e) => setFormValues((prev) => ({ ...prev, username: e.target.value }))}
              placeholder={t('personalForm.fullNamePlaceholder')}
              className={`input input-bordered w-full ${state.errors?.fullName ? 'input-error' : ''}`}
            />
            {state.errors?.fullName && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.fullName[0])}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">{t('personalForm.emailLabel')}</span>
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              className="input input-bordered w-full"
              disabled
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="phone">
              <span className="label-text">{t('personalForm.phoneLabel')}</span>
            </label>
            <IMaskInput
              key={`phone-${formKey}`}
              mask="(00) 00000-0000"
              id="phone"
              name="phone"
              type="tel"
              placeholder={t('personalForm.phonePlaceholder')}
              className={`input input-bordered w-full ${state.errors?.phone ? 'input-error' : ''}`}
              value={formValues.phone}
              onAccept={(value) => setFormValues((prev) => ({ ...prev, phone: value || '' }))}
            />
            {state.errors?.phone && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.phone[0])}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="cpf">
              <span className="label-text">{t('personalForm.cpfLabel')}</span>
            </label>
            <IMaskInput
              key={`cpf-${formKey}`}
              mask="000.000.000-00"
              id="cpf"
              name="cpf"
              type="text"
              placeholder={t('personalForm.cpfPlaceholder')}
              className={`input input-bordered w-full ${state.errors?.cpf ? 'input-error' : ''}`}
              value={formValues.cpf}
              onAccept={(value) => setFormValues((prev) => ({ ...prev, cpf: value || '' }))}
            />
            {state.errors?.cpf && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.cpf[0])}</span>
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn bg-primary text-white hover:bg-primary/90">
            {t('common.saveChanges')}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}
