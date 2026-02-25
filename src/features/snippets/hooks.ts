import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context'
import * as api from './api'
import type { Snippet, SnippetInput } from './types'

const SNIPPETS_QUERY_KEY = 'snippets'

export function useSnippets() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [SNIPPETS_QUERY_KEY, user?.uid],
    queryFn: () => api.fetchSnippets(user!.uid),
    enabled: !!user?.uid,
  })
}

export function useCreateSnippet() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SnippetInput) =>
      api.createSnippet(user!.uid, input),
    onSuccess: (newSnippet: Snippet) => {
      queryClient.setQueryData<Snippet[]>(
        [SNIPPETS_QUERY_KEY, user?.uid],
        (prev) => [newSnippet, ...(prev ?? [])]
      )
      queryClient.invalidateQueries({
        queryKey: [SNIPPETS_QUERY_KEY, user?.uid],
      })
    },
  })
}

export function useUpdateSnippet() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<SnippetInput> }) =>
      api.updateSnippet(user!.uid, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SNIPPETS_QUERY_KEY, user?.uid],
      })
    },
  })
}

export function useDeleteSnippet() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteSnippet(user!.uid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SNIPPETS_QUERY_KEY, user?.uid],
      })
    },
  })
}
