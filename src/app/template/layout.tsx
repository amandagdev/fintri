import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

type Props = {
  children: ReactNode
}

export default async function QuoteLayout({ children }: Props) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale="pt" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
