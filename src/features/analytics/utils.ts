/**
 * Get YYYY-MM-DD from an ISO date string.
 */
function toDateKey(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toISOString().slice(0, 10)
}

/**
 * All activity dates (unique days) from projects, notes, snippets.
 */
export function getActivityDates(
  projects: { createdAt: string; updatedAt: string }[],
  notes: { createdAt: string; updatedAt: string }[],
  snippets: { createdAt: string; updatedAt: string }[]
): string[] {
  const set = new Set<string>()
  const add = (iso: string) => {
    const key = toDateKey(iso)
    if (key) set.add(key)
  }
  projects.forEach((p) => {
    add(p.createdAt)
    add(p.updatedAt)
  })
  notes.forEach((n) => {
    add(n.createdAt)
    add(n.updatedAt)
  })
  snippets.forEach((s) => {
    add(s.createdAt)
    add(s.updatedAt)
  })
  return Array.from(set).sort()
}

/**
 * Longest consecutive run of days (sorted date keys).
 */
function longestConsecutiveDays(sortedDateKeys: string[]): number {
  if (sortedDateKeys.length === 0) return 0
  let max = 1
  let current = 1
  for (let i = 1; i < sortedDateKeys.length; i++) {
    const prev = new Date(sortedDateKeys[i - 1]).getTime()
    const curr = new Date(sortedDateKeys[i]).getTime()
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      current++
      max = Math.max(max, current)
    } else {
      current = 1
    }
  }
  return max
}

/**
 * Current streak: consecutive days including today or yesterday.
 */
export function currentStreak(sortedDateKeys: string[]): number {
  if (sortedDateKeys.length === 0) return 0
  const today = toDateKey(new Date().toISOString())
  if (!sortedDateKeys.includes(today)) {
    const yesterday = toDateKey(new Date(Date.now() - 864e5).toISOString())
    if (!sortedDateKeys.includes(yesterday)) return 0
  }
  let count = 0
  let d = new Date()
  const asKey = (date: Date) => date.toISOString().slice(0, 10)
  while (sortedDateKeys.includes(asKey(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

export function longestStreak(sortedDateKeys: string[]): number {
  return longestConsecutiveDays(sortedDateKeys)
}

/**
 * Activity count per day for the last N days.
 */
export function getActivityTimeline(
  projects: { createdAt: string; updatedAt: string }[],
  notes: { createdAt: string; updatedAt: string }[],
  snippets: { createdAt: string; updatedAt: string }[],
  days: number = 30
): { date: string; count: number; projects: number; notes: number; snippets: number }[] {
  const start = new Date()
  start.setDate(start.getDate() - days)
  const map = new Map<
    string,
    { count: number; projects: number; notes: number; snippets: number }
  >()
  const add = (
    iso: string,
    type: 'projects' | 'notes' | 'snippets'
  ) => {
    const key = toDateKey(iso)
    if (!key) return
    const d = new Date(key)
    if (d < start) return
    const prev = map.get(key) ?? {
      count: 0,
      projects: 0,
      notes: 0,
      snippets: 0,
    }
    prev.count++
    prev[type]++
    map.set(key, prev)
  }
  projects.forEach((p) => {
    add(p.createdAt, 'projects')
    add(p.updatedAt, 'projects')
  })
  notes.forEach((n) => {
    add(n.createdAt, 'notes')
    add(n.updatedAt, 'notes')
  })
  snippets.forEach((s) => {
    add(s.createdAt, 'snippets')
    add(s.updatedAt, 'snippets')
  })
  const result: { date: string; count: number; projects: number; notes: number; snippets: number }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const entry = map.get(key) ?? {
      count: 0,
      projects: 0,
      notes: 0,
      snippets: 0,
    }
    result.push({ date: key, ...entry })
  }
  return result
}

/**
 * Tech stack counts from projects (and optionally snippet languages).
 */
export function getTechStackCounts(
  projects: { techStack: string[] }[],
  snippets: { language: string }[]
): { name: string; count: number }[] {
  const map = new Map<string, number>()
  projects.forEach((p) => {
    p.techStack.forEach((t) => {
      const key = t.trim()
      if (key) map.set(key, (map.get(key) ?? 0) + 1)
    })
  })
  snippets.forEach((s) => {
    const key = s.language
    if (key) map.set(key, (map.get(key) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
}
