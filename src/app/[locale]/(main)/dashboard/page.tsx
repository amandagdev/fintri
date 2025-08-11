'use client'

import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Header from '@/features/dahsboard/components/header/header'
import Sidebar from '@/features/dahsboard/components/sidebar/sidebar'
import type { Proposal } from '@/features/dahsboard/components/table/table'
import Table from '@/features/dahsboard/components/table/table'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  const mockBudgets: Proposal[] = [
    {
      id: '1',
      client: 'João da Silva',
      date: '2025-08-05',
      status: 'aprovado',
      value: 'R$ 1.250,00',
    },
    {
      id: '2',
      client: 'Maria Oliveira',
      date: '2025-08-07',
      status: 'pendente',
      value: 'R$ 3.400,00',
    },
    { id: '3', client: 'Empresa XPTO', date: '2025-08-08', status: 'recusado', value: 'R$ 950,00' },
    {
      id: '4',
      client: 'Carlos Almeida',
      date: '2025-08-09',
      status: 'aprovado',
      value: 'R$ 5.800,00',
    },
    {
      id: '5',
      client: 'Fernanda Souza',
      date: '2025-08-10',
      status: 'pendente',
      value: 'R$ 2.100,00',
    },
  ]

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <label htmlFor="sidebar-drawer" className="btn btn-ghost lg:hidden m-4">
          <Menu className="w-6 h-6" />
        </label>

        <main className="bg-white p-6 space-y-6 w-full h-screen">
          <div className="space-y-4">
            <Header />
          </div>

          <Table data={mockBudgets} />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay">
          <span className="sr-only">Fechar menu</span>
        </label>
        <Sidebar />
      </div>
    </div>
  )
}
