import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context'
import * as api from './api'
import type { UserSettings } from './types'

const SETTINGS_QUERY_KEY = 'settings'

export function useSettings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY, user?.uid],
    queryFn: () => api.fetchSettings(user!.uid),
    enabled: !!user?.uid,
  })
}

export function useUpdateSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<Omit<UserSettings, 'updatedAt'>>) =>
      api.updateSettings(user!.uid, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY, user?.uid] })
    },
  })
}
