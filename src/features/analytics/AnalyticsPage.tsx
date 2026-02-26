import { useMemo } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import { useProjects } from '@/features/projects/hooks'
import { useNotes } from '@/features/notes/hooks'
import { useSnippets } from '@/features/snippets/hooks'
import {
  getActivityDates,
  currentStreak,
  longestStreak,
  getActivityTimeline,
  getTechStackCounts,
} from './utils'

const PIE_COLORS = ['#22c55e', '#e2e8f0']
const AREA_COLOR = '#3b82f6'

export function AnalyticsPage() {
  const { data: projects = [] } = useProjects()
  const { data: notes = [] } = useNotes()
  const { data: snippets = [] } = useSnippets()

  const completedCount = useMemo(
    () => projects.filter((p) => p.status === 'completed').length,
    [projects]
  )
  const projectsPieData = useMemo(
    () => [
      { name: 'Completed', value: completedCount },
      { name: 'Other', value: Math.max(0, projects.length - completedCount) },
    ],
    [projects.length, completedCount]
  )

  const activityDates = useMemo(
    () => getActivityDates(projects, notes, snippets),
    [projects, notes, snippets]
  )
  const streakCurrent = useMemo(() => currentStreak(activityDates), [activityDates])
  const streakLongest = useMemo(() => longestStreak(activityDates), [activityDates])

  const techStackData = useMemo(
    () => getTechStackCounts(projects, snippets),
    [projects, snippets]
  )

  const timelineData = useMemo(
    () => getActivityTimeline(projects, notes, snippets, 30),
    [projects, notes, snippets]
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Analytics</h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Projects completed</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">{completedCount}</p>
          <p className="text-xs text-gray-400">of {projects.length} total</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Current streak</h3>
          <p className="mt-1 text-2xl font-bold text-amber-600">{streakCurrent}</p>
          <p className="text-xs text-gray-400">days in a row</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Longest streak</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">{streakLongest}</p>
          <p className="text-xs text-gray-400">days</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total activity</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {projects.length + notes.length + snippets.length}
          </p>
          <p className="text-xs text-gray-400">items</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Projects completed
          </h3>
          <div className="min-h-[12rem] w-full">
            <ResponsiveContainer width="100%" height={192}>
              <PieChart>
                <Pie
                  data={projectsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={64}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }: { name: string; value: number }) =>
                    value > 0 ? `${name}: ${value}` : null
                  }
                >
                  {projectsPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Tech stack usage
          </h3>
          <div className="min-h-[16rem] w-full">
            {techStackData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                No tech stack data yet (add projects or snippets)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart
                  data={techStackData}
                  layout="vertical"
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#64748b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Activity timeline (last 30 days)
        </h3>
        <div className="min-h-[16rem] w-full">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart
              data={timelineData}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={AREA_COLOR} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={AREA_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => {
                  const d = new Date(v)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
                formatter={(value, name) => {
                  const v = Number(value ?? 0)
                  const n = String(name ?? '')
                  if (n === 'count') return [v, 'Activities']
                  if (n === 'projects') return [v, 'Projects']
                  if (n === 'notes') return [v, 'Notes']
                  if (n === 'snippets') return [v, 'Snippets']
                  return [v, n]
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={AREA_COLOR}
                strokeWidth={2}
                fill="url(#activityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
