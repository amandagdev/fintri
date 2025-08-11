'use client'

import Header from '@/features/dahsboard/components/header/header'
import type { Proposal } from '@/features/dahsboard/components/table/table'
import Table from '@/features/dahsboard/components/table/table'

export default function DashboardPage() {
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
    <main className="bg-white p-6 space-y-6 w-full h-screen">
      <div className="space-y-4">
        <Header />
      </div>

      <Table data={mockBudgets} />
    </main>
  )
}
