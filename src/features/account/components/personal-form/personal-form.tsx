'use client'

import { useActionState, useEffect } from 'react'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

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

  useEffect(() => {
    if (state.message && typeof state.message === 'string') {
      if (state.message.includes('success')) {
        toast.success(t(state.message))
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
              defaultValue={user?.username || ''}
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
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user?.phone || ''}
              placeholder={t('personalForm.phonePlaceholder')}
              className={`input input-bordered w-full ${state.errors?.phone ? 'input-error' : ''}`}
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
            <input
              id="cpf"
              name="cpf"
              type="text"
              defaultValue={user?.cpf || ''}
              placeholder={t('personalForm.cpfPlaceholder')}
              className={`input input-bordered w-full ${state.errors?.cpf ? 'input-error' : ''}`}
            />
            {state.errors?.cpf && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.cpf[0])}</span>
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn bg-[#1b6d71] text-white hover:bg-[#2cb5a0]">
            {t('common.saveChanges')}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}
