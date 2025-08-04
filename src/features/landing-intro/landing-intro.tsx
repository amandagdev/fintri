import { useTranslations } from 'next-intl'

export default function LandingIntro() {
  const t = useTranslations('landingIntro')

  return (
    <div className="py-24 px-8 text-center bg-white">
      <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-8">
        {t('about')} <span className="bg-teal-600 p-2 rounded-xl text-white">{t('budgets')}</span>
      </h2>
      <p className="text-gray-600 text-md">{t('description')}</p>
      <p className="text-gray-600 text-md">{t('descriptionTwo')}</p>
      <button className="btn bg-[#253936]  text-white hover:bg-teal-600 font-normal mt-8">
        {t('register')}
      </button>
    </div>
  )
}
