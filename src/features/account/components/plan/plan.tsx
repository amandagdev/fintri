'use client'

import { useTranslations } from 'next-intl'

import Wrapper from '../../utils/wrapper'

export default function Plan() {
  const t = useTranslations('account')

  const currentPlanName = 'Premium'
  const nextBillingDate = '10 de Setembro de 2025'

  return (
    <Wrapper title={t('planSection.title')} description={t('planSection.description')}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
        <div>
          <p className="font-semibold text-gray-700">
            {t('planSection.currentPlanText')}
            <span className="text-[#1b6d71] mx-1">{currentPlanName}</span>.
          </p>
          <p className="text-sm text-gray-500">
            {t('planSection.nextBillingText')} {nextBillingDate}.
          </p>
        </div>
        <button className="btn btn-outline border-[#1b6d71] text-[#1b6d71] hover:bg-[#1b6d71] hover:text-white mt-4 sm:mt-0">
          {t('planSection.manageButton')}
        </button>
      </div>
    </Wrapper>
  )
}
