import { WeeklySummaryCard } from './WeeklySummaryCard'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-gray-600">Overview and quick actions.</p>
      </div>

      <section className="max-w-2xl">
        <WeeklySummaryCard />
      </section>
    </div>
  )
}
