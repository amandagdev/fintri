'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import Tabs from '@/common/components/tabs/tabs'

import type { Company, User } from '../types'
import CompanyForm from './company-form/company-form'
import PersonalForm from './personal-form/personal-form'
import Plan from './plan/plan'
import Security from './security/security'

interface AccountPageProps {
  readonly user: User
  readonly company: Company
}

export default function AccountPage({ user, company }: AccountPageProps) {
  const t = useTranslations('account')
  const [activeTab, setActiveTab] = useState('personal')

  const tabItems = [
    { label: t('tabs.personal'), value: 'personal' },
    { label: t('tabs.company'), value: 'company' },
    { label: t('tabs.plan'), value: 'plan' },
    { label: t('tabs.security'), value: 'security' },
  ]

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-8 w-full">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('header.title')}</h1>
          <p className="text-gray-500 mt-1">{t('header.subtitle')}</p>
        </header>

        <div className="mb-8">
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div>
          {activeTab === 'personal' && <PersonalForm user={user} />}
          {activeTab === 'company' && <CompanyForm company={company} />}
          {activeTab === 'plan' && <Plan />}
          {activeTab === 'security' && <Security />}
        </div>
      </div>
    </main>
  )
}
