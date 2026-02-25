import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context'
import * as api from './api'
import type { ProjectInput } from './types'

const PROJECTS_QUERY_KEY = 'projects'

export function useProjects() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, user?.uid],
    queryFn: () => api.fetchProjects(user!.uid),
    enabled: !!user?.uid,
  })
}

export function useCreateProject() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) =>
      api.createProject(user!.uid, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, user?.uid] })
    },
  })
}

export function useUpdateProject() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: Partial<ProjectInput>
    }) => api.updateProject(user!.uid, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, user?.uid] })
    },
  })
}

export function useDeleteProject() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteProject(user!.uid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, user?.uid] })
    },
  })
}
