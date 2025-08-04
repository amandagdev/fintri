import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'

import Footer from '@/common/components/footer/footer'
import Header from '@/common/components/header/header'
import { routing } from '@/i18n/routing'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <div className="flex flex-col min-h-screen">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
        {children}
        <Footer />
      </NextIntlClientProvider>
    </div>
  )
}
