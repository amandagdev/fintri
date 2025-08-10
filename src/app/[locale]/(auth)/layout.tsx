import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { routing } from '@/i18n/routing'

interface AuthLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen items-center justify-center bg-white">{children}</div>
    </NextIntlClientProvider>
  )
}
