import Image from 'next/image'
import { useTranslations } from 'next-intl'

type Feature = {
  title: string
  description: string
}

export default function LandingStarted() {
  const t = useTranslations('landingStarted')
  const featuresData = t.raw('features') as Feature[]

  return (
    <section className="bg-neutral-100 w-full px-8 py-12">
      <div className="container mx-auto lg:py-18 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2cb5a0]">
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

        <div className="hidden lg:flex w-full lg:justify-end">
          <Image
            src="/images/landing-started.png"
            alt="Dashboard da plataforma Fintri"
            width={500}
            height={200}
            className="rounded-lg shadow-xl lg:h-[400px] lg:w-[400px]"
          />
        </div>
      </div>
    </section>
  )
}
