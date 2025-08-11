'use client'

import { useTranslations } from 'next-intl'

import Wrapper from '../../utils/wrapper'

export default function CompanyForm() {
  const t = useTranslations('account')

  const saveButton = (
    <button className="btn bg-[#1b6d71] text-white hover:bg-[#2cb5a0]">
      {t('common.saveChanges')}
    </button>
  )

  return (
    <Wrapper
      title={t('companyForm.title')}
      description={t('companyForm.description')}
      footer={saveButton}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label" htmlFor="companyName">
            <span className="label-text">{t('companyForm.companyNameLabel')}</span>
          </label>
          <input
            id="companyName"
            type="text"
            placeholder={t('companyForm.companyNamePlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="cnpj">
            <span className="label-text">{t('companyForm.cnpjLabel')}</span>
          </label>
          <input
            id="cnpj"
            type="text"
            placeholder={t('companyForm.cnpjPlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control col-span-1 md:col-span-2">
          <label className="label" htmlFor="address">
            <span className="label-text">{t('companyForm.addressLabel')}</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder={t('companyForm.addressPlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="companyEmail">
            <span className="label-text">{t('companyForm.companyEmailLabel')}</span>
          </label>
          <input
            id="companyEmail"
            type="email"
            placeholder={t('companyForm.companyEmailPlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="companyLogo">
            <span className="label-text">{t('companyForm.logoLabel')}</span>
          </label>
          <input id="companyLogo" type="file" className="file-input file-input-bordered w-full" />
        </div>
      </div>
    </Wrapper>
  )
}
