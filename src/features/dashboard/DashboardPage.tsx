import { WeeklySummaryCard } from './WeeklySummaryCard'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">Overview and quick actions.</p>
      </div>

      <section className="w-full max-w-2xl">
        <WeeklySummaryCard />
      </section>
    </div>
  )
}
