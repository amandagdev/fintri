import { useTranslations } from 'next-intl'

export default function LandingPrice() {
  const t = useTranslations('landingPrice')
  const features = t.raw('features') as string[]

  return (
    <section id="preco" className="bg-white py-16 lg:py-24 w-full">
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t('title')}</h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">{t('subtitle')}</p>

        <div className="card mt-12 w-full max-w-md bg-teal-600 shadow-xl border border-gray-200">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{t('planName')}</h2>

            <div className="mt-4 flex items-baseline justify-center gap-x-2">
              <span className="text-2xl font-medium text-white">{t('priceCurrency')}</span>
              <span className="text-5xl font-bold tracking-tight text-white">{t('price')}</span>
              <span className="text-lg font-medium text-white">{t('priceSuffix')}</span>
            </div>

            <div className="card-actions w-full mt-6">
              <button className="btn bg-[#253936] w-full text-lg">{t('cta')}</button>
            </div>

            <ul className="mt-6 space-y-3 text-left text-sm leading-6 text-white">
              {features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
