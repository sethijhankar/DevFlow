import type { Project } from '@/features/projects/types'
import type { Note } from '@/features/notes/types'
import type { Snippet } from '@/features/snippets/types'

export interface WeeklySummaryData {
  weekLabel: string
  summary: string
  generatedAt: string
}

/**
 * Get start of week (Monday) for a date.
 */
function getWeekStart(d: Date): Date {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

/**
 * Format as "Feb 24 – Mar 2, 2026".
 */
export function getWeekLabel(date: Date = new Date()): string {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

/**
 * Filter items updated/created in the given week (Monday–Sunday).
 */
function isInWeek(iso: string, weekStart: Date): boolean {
  const d = new Date(iso)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  return d >= weekStart && d < weekEnd
}

/**
 * Build a text payload of this week's activity for OpenAI.
 */
export function buildActivityPayload(
  projects: Project[],
  notes: Note[],
  snippets: Snippet[]
): string {
  const now = new Date()
  const weekStart = getWeekStart(now)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weekProjects = projects.filter(
    (p) => isInWeek(p.updatedAt, weekStart) || isInWeek(p.createdAt, weekStart)
  )
  const weekNotes = notes.filter(
    (n) => isInWeek(n.updatedAt, weekStart) || isInWeek(n.createdAt, weekStart)
  )
  const weekSnippets = snippets.filter(
    (s) => isInWeek(s.updatedAt, weekStart) || isInWeek(s.createdAt, weekStart)
  )

  const lines: string[] = []
  lines.push(`Week: ${getWeekLabel(now)}`)
  lines.push('')
  lines.push('## Projects')
  if (weekProjects.length === 0) lines.push('No project activity this week.')
  else
    weekProjects.forEach((p) => {
      lines.push(`- ${p.title} (status: ${p.status}, progress: ${p.progress}%)`)
      if (p.techStack.length) lines.push(`  Tech: ${p.techStack.join(', ')}`)
    })
  lines.push('')
  lines.push('## Notes')
  if (weekNotes.length === 0) lines.push('No note activity this week.')
  else
    weekNotes.forEach((n) => {
      lines.push(`- ${n.title || 'Untitled'}`)
    })
  lines.push('')
  lines.push('## Code snippets')
  if (weekSnippets.length === 0) lines.push('No snippet activity this week.')
  else
    weekSnippets.forEach((s) => {
      lines.push(`- ${s.title || 'Untitled'} (${s.language})`)
    })

  return lines.join('\n')
}
