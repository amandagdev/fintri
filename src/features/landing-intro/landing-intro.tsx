import { useTranslations } from 'next-intl'

export default function LandingIntro() {
  const t = useTranslations('landingIntro')

  return (
    <div className="container mx-auto px-6 lg:px-12 lg:py-18 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-8">
        {t('about')} <span className="bg-green-300 p-2 rounded-xl">{t('budgets')}</span>
      </h2>
      <p className="text-gray-600 text-md">{t('description')}</p>
      <button className="btn-outline text-black font-normal mt-8">{t('register')}</button>
    </div>
  )
}
