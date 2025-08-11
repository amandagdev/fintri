import type { ReactNode } from 'react'

import Footer from '@/common/components/footer/footer'
import Header from '@/common/components/header/header'

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
