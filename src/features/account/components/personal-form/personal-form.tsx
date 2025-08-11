'use client'

import { useTranslations } from 'next-intl'

import Wrapper from '../../utils/wrapper'

export default function PersonalForm() {
  const t = useTranslations('account')

  const saveButton = (
    <button className="btn bg-[#1b6d71] text-white hover:bg-[#2cb5a0]">
      {t('common.saveChanges')}
    </button>
  )

  return (
    <Wrapper
      title={t('personalForm.title')}
      description={t('personalForm.description')}
      footer={saveButton}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label" htmlFor="fullName">
            <span className="label-text">{t('personalForm.fullNameLabel')}</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder={t('personalForm.fullNamePlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">{t('personalForm.emailLabel')}</span>
          </label>
          <input id="email" type="email" className="input input-bordered w-full" disabled />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="phone">
            <span className="label-text">{t('personalForm.phoneLabel')}</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder={t('personalForm.phonePlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="cpf">
            <span className="label-text">{t('personalForm.cpfLabel')}</span>
          </label>
          <input
            id="cpf"
            type="text"
            placeholder={t('personalForm.cpfPlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </Wrapper>
  )
}
