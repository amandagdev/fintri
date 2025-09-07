import Header from '@/features/dahsboard/components/header/header'
import { StatsCards } from '@/features/dahsboard/components/stats-cards'
import { DashboardTable } from '@/features/dahsboard/components/table/table'
import { getQuotes } from '@/features/quote/services/service'

export default async function DashboardPage() {
  const quotes = await getQuotes()

  return (
    <main className="bg-white p-6 space-y-6 w-full h-screen">
      <div className="space-y-4">
        <Header />
      </div>

      <StatsCards quotes={quotes} />

      <DashboardTable data={quotes} />
    </main>
  )
}
