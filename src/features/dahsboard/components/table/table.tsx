'use client'

import { Share2 } from 'lucide-react'
import Link from 'next/link'

import { formatCurrency, formatDate } from '@/lib/utils'

export interface Proposal {
  id: string
  client: string
  date: string
  status: 'aprovado' | 'pendente' | 'recusado'
  value: string
}

interface Props {
  data: Proposal[]
}

export default function Table({ data }: Props) {
  const getStatusClass = (status: Proposal['status']) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'pendente':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'recusado':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return ''
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="text-[#1b6d71] text-sm font-medium border-b border-gray-200">
            <th className="bg-white">Cliente</th>
            <th className="bg-white">Data</th>
            <th className="bg-white">Status</th>
            <th className="bg-white">Valor</th>
            <th className="bg-white" colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((proposal) => (
            <tr key={proposal.id} className="hover:bg-gray-50 transition">
              <td className="py-3">{proposal.client}</td>
              <td>{formatDate(proposal.date)}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-sm text-xs font-medium ${getStatusClass(
                    proposal.status,
                  )}`}
                >
                  {proposal.status}
                </span>
              </td>
              <td>{formatCurrency(proposal.value)}</td>
              <td>
                <Link
                  href={`/dashboard/budgets/${proposal.id}`}
                  className="btn btn-sm px-4 whitespace-nowrap text-sm bg-[#2cb5a0] text-white border-none hover:bg-[#155d61] transition"
                >
                  Ver proposta
                </Link>
              </td>
              <td>
                <button
                  onClick={() => console.log('Compartilhar', proposal.id)}
                  className="btn btn-sm text-sm bg-[#2cb5a0]  text-white gap-2 border-none"
                >
                  <Share2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
