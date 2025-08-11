'use client'

import { useTranslations } from 'next-intl'

import Wrapper from '../../utils/wrapper'

export default function Security() {
  const t = useTranslations('account')

  const savePasswordButton = (
    <button className="btn bg-[#1b6d71] text-white hover:bg-[#2cb5a0]">
      {t('securitySection.updatePasswordButton')}
    </button>
  )

  return (
    <div className="space-y-8">
      <Wrapper
        title={t('securitySection.changePasswordTitle')}
        description={t('securitySection.changePasswordDescription')}
        footer={savePasswordButton}
      >
        <div className="space-y-4">
          <div className="form-control">
            <label className="label " htmlFor="currentPassword">
              <span className="label-text">{t('securitySection.currentPasswordLabel')}</span>
            </label>
            <input id="currentPassword" type="password" className="input input-bordered w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label" htmlFor="newPassword">
                <span className="label-text">{t('securitySection.newPasswordLabel')}</span>
              </label>
              <input id="newPassword" type="password" className="input input-bordered w-full" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">{t('securitySection.confirmPasswordLabel')}</span>
              </label>
              <input id="confirmPassword" type="password" className="input input-bordered w-full" />
            </div>
          </div>
        </div>
      </Wrapper>

      <Wrapper
        title={t('securitySection.deleteAccountTitle')}
        description={t('securitySection.deleteAccountDescription')}
      >
        <button className="btn btn-error text-white">
          {t('securitySection.deleteAccountButton')}
        </button>
      </Wrapper>
    </div>
  )
}
