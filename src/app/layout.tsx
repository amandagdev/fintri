import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fintri',
  description: 'Fintri is a modern finance app that helps you manage your finances with ease.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="light">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
