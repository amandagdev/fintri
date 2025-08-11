'use client'

import {
  BarChart2,
  FilePlus,
  FileText,
  LayoutDashboard,
  LogOut,
  UserPlus,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Sidebar() {
  const t = useTranslations('dashboard.sidebar')
  const pathname = usePathname()

  const menuItems = [
    { href: '/dashboard', label: t('home'), icon: LayoutDashboard },
    { href: '/dashboard/create-budget', label: t('createBudget'), icon: FilePlus },
    { href: '/dashboard/my-budgets', label: t('myBudgets'), icon: FileText },
    { href: '/dashboard/add-client', label: t('addClient'), icon: UserPlus },
    { href: '/dashboard/my-clients', label: t('myClients'), icon: Users },
    { href: '/dashboard/analytics', label: t('analytics'), icon: BarChart2 },
  ]

  return (
    <aside className="w-72 bg-white text-gray-500 flex flex-col min-h-screen">
      <div className="p-4 border-b border-white/20 flex flex-col items-center">
        <Link href="/" className="text-xl text-[#1b6d71] font-bold">
          <Image src="/images/logo.png" alt="Logo" width={80} height={50} />
        </Link>
        <p className="text-md text-gray-500">{t('subtitle')}</p>
      </div>

      <ul className="menu p-4 flex-1 space-y-2 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  isActive ? 'bg-[#1b6d71] text-white' : 'hover:bg-[#1b6d71] hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="p-4 border-t border-white/20">
        <button className="flex items-center gap-3 w-full text-left rounded-lg px-3 py-2 hover:bg-[#1b6d71] hover:text-white transition">
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </aside>
  )
}
