import Link from 'next/link'

import { useTranslations } from 'next-intl'

export default function LandingIntro() {
  const t = useTranslations('landingIntro')

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 text-center bg-white">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6 sm:mb-8 leading-tight">
        <span className="block sm:inline">{t('about')}</span>
        <span className="block sm:inline sm:ml-2 bg-primary px-3 py-2 rounded-xl text-white text-xl sm:text-2xl lg:text-3xl mt-2 sm:mt-0">
          {t('budgets')}
        </span>
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-2">{t('description')}</p>
      <p className="text-gray-600 text-sm sm:text-base">{t('descriptionTwo')}</p>
      <button className="btn bg-primary border-none text-white hover:bg-primary-dark font-normal mt-6 sm:mt-8">
        <Link href="/register">{t('register')}</Link>
      </button>
    </div>
  )
}
