import { Menu } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Sidebar from '@/common/components/sidebar/sidebar'

export default async function ProtectedMainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-white">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col items-start">
        <label
          htmlFor="sidebar-drawer"
          className="btn btn-ghost lg:hidden absolute top-4 left-4 z-10"
        >
          <Menu className="w-6 h-6" />
        </label>
        {children}
      </div>

      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <Sidebar />
      </div>
    </div>
  )
}
