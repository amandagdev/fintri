import type { ReactNode } from 'react'

import { notFound } from 'next/navigation'

import { getMessages } from 'next-intl/server'

import { NextIntlClientProvider, hasLocale } from 'next-intl'

import { routing } from '@/i18n/routing'

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-white">{children}</div>
    </NextIntlClientProvider>
  )
}
