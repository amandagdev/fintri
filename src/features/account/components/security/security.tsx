'use client'

import { useActionState, useEffect } from 'react'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { updatePasswordAction } from '../../actions'
import Wrapper from '../../utils/wrapper'

export default function Security() {
  const t = useTranslations('account')
  const [state, formAction] = useActionState(updatePasswordAction, {})

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
    <div className="space-y-8">
      <form action={formAction} className="space-y-4">
        <Wrapper
          title={t('securitySection.changePasswordTitle')}
          description={t('securitySection.changePasswordDescription')}
          footer={
            <button type="submit" className="btn bg-[#1b6d71] text-white hover:bg-[#2cb5a0]">
              {t('securitySection.updatePasswordButton')}
            </button>
          }
        >
          <div className="form-control">
            <label className="label" htmlFor="currentPassword">
              <span className="label-text">{t('securitySection.currentPasswordLabel')}</span>
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              className={`input input-bordered w-full ${state.errors?.currentPassword ? 'input-error' : ''}`}
            />
            {state.errors?.currentPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(state.errors.currentPassword[0])}
                </span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">{t('securitySection.newPasswordLabel')}</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input input-bordered w-full ${state.errors?.password ? 'input-error' : ''}`}
              />
              {state.errors?.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{t(state.errors.password[0])}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="passwordConfirmation">
                <span className="label-text">{t('securitySection.confirmPasswordLabel')}</span>
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                className={`input input-bordered w-full ${state.errors?.passwordConfirmation ? 'input-error' : ''}`}
              />
              {state.errors?.passwordConfirmation && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t(state.errors.passwordConfirmation[0])}
                  </span>
                </label>
              )}
            </div>
          </div>
        </Wrapper>
      </form>

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
