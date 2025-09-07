import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'

type Props = {
  children: ReactNode
}

export default async function TemplateLayout({ children }: Props) {
  return <NextIntlClientProvider locale="pt">{children}</NextIntlClientProvider>
}
