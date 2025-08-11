'use client'

import { useTranslations } from 'next-intl'

import Sidebar from '@/features/dahsboard/components/sidebar/sidebar'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  return (
    <div className="flex ">
      <Sidebar />
      <h1>{t('title')}</h1>
    </div>
  )
}
