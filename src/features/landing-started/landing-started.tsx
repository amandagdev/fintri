import { useTranslations } from 'next-intl'

import Carousel from './carousel'

type Feature = {
  title: string
  description: string
}

export default function LandingStarted() {
  const t = useTranslations('landingStarted')
  const featuresData = t.raw('features') as Feature[]

  return (
    <section id="como-funciona" className="bg-gray-50 w-full px-8 py-12">
      <div className="container mx-auto lg:py-18 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary">
            {t('about')} <span className="text-[#3f3f46]">{t('aboutTwo')}</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">{t('description')}</p>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 ">
            {featuresData.map((feature) => (
              <div key={feature.title}>
                <h3 className="font-semibold text-gray-600">{feature.title}</h3>
                <p className="mt-1 text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:justify-center">
          <Carousel />
        </div>
      </div>
    </section>
  )
}
