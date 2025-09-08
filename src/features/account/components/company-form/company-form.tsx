'use client'

import { useActionState, useEffect } from 'react'

import { useTranslations } from 'next-intl'
import { IMaskInput } from 'react-imask'
import { toast } from 'sonner'

import { updateCompanyDataAction } from '../../actions'
import type { Company } from '../../types'
import Wrapper from '../../utils/wrapper'

interface CompanyFormProps {
  readonly company?: Company
}

export default function CompanyForm({ company }: CompanyFormProps) {
  const t = useTranslations('account')
  const [state, formAction] = useActionState(updateCompanyDataAction, {})

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
    <Wrapper title={t('companyForm.title')} description={t('companyForm.description')}>
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label" htmlFor="companyName">
              <span className="label-text">{t('companyForm.companyNameLabel')}</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={company?.name || ''}
              placeholder={t('companyForm.companyNamePlaceholder')}
              className={`input input-bordered w-full ${state.errors?.company?.name ? 'input-error' : ''}`}
            />
            {state.errors?.company?.name && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.company.name[0])}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="cnpj">
              <span className="label-text">{t('companyForm.cnpjLabel')}</span>
            </label>
            <IMaskInput
              mask="00.000.000/0000-00"
              id="cnpj"
              name="cnpj"
              type="text"
              defaultValue={company?.cnpj || ''}
              placeholder={t('companyForm.cnpjPlaceholder')}
              className={`input input-bordered w-full ${state.errors?.company?.cnpj ? 'input-error' : ''}`}
            />
            {state.errors?.company?.cnpj && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.company.cnpj[0])}</span>
              </label>
            )}
          </div>

          <div className="form-control col-span-1 md:col-span-2">
            <label className="label" htmlFor="address">
              <span className="label-text">{t('companyForm.addressLabel')}</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={company?.address || ''}
              placeholder={t('companyForm.addressPlaceholder')}
              className={`input input-bordered w-full ${state.errors?.company?.address ? 'input-error' : ''}`}
            />
            {state.errors?.company?.address && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(state.errors.company.address[0])}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="companyEmail">
              <span className="label-text">{t('companyForm.companyEmailLabel')}</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={company?.email || ''}
              placeholder={t('companyForm.companyEmailPlaceholder')}
              className={`input input-bordered w-full ${state.errors?.company?.email ? 'input-error' : ''}`}
            />
            {state.errors?.company?.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(state.errors.company.email[0])}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="phone">
              <span className="label-text">{t('companyForm.phoneLabel')}</span>
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              id="phone"
              name="phone"
              type="tel"
              defaultValue={company?.phone || ''}
              placeholder={t('companyForm.phonePlaceholder')}
              className={`input input-bordered w-full ${state.errors?.company?.phone ? 'input-error' : ''}`}
            />
            {state.errors?.company?.phone && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(state.errors.company.phone[0])}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="companyLogo">
              <span className="label-text">{t('companyForm.logoLabel')}</span>
            </label>
            <input
              id="logo"
              name="logo"
              type="file"
              className="file-input file-input-bordered w-full"
            />
            {state.errors?.company?.logo && (
              <label className="label">
                <span className="label-text-alt text-error">{t(state.errors.company.logo[0])}</span>
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
