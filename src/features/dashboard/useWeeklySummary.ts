import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context'
import { useProjects } from '@/features/projects/hooks'
import { useNotes } from '@/features/notes/hooks'
import { useSnippets } from '@/features/snippets/hooks'
import { generateWeeklySummaryFromActivity } from '@/lib/openai'
import * as summaryApi from './summaryApi'
import {
  buildActivityPayload,
  getWeekLabel,
  type WeeklySummaryData,
} from './weeklySummary'

const WEEKLY_SUMMARY_QUERY_KEY = 'weeklySummary'

export function useWeeklySummary() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [WEEKLY_SUMMARY_QUERY_KEY, user?.uid],
    queryFn: () => summaryApi.fetchWeeklySummary(user!.uid),
    enabled: !!user?.uid,
  })
}

export function useGenerateWeeklySummary() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data: projects = [] } = useProjects()
  const { data: notes = [] } = useNotes()
  const { data: snippets = [] } = useSnippets()

  return useMutation({
    mutationFn: async (): Promise<WeeklySummaryData> => {
      const payload = buildActivityPayload(projects, notes, snippets)
      const summary = await generateWeeklySummaryFromActivity(payload)
      const weekLabel = getWeekLabel()
      const saved = await summaryApi.saveWeeklySummary(user!.uid, {
        weekLabel,
        summary,
      })
      return saved
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WEEKLY_SUMMARY_QUERY_KEY, user?.uid],
      })
    },
  })
}
