import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context'
import * as api from './api'
import type { Note, NoteInput } from './types'

const NOTES_QUERY_KEY = 'notes'

export function useNotes() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, user?.uid],
    queryFn: () => api.fetchNotes(user!.uid),
    enabled: !!user?.uid,
  })
}

export function useCreateNote() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NoteInput) => api.createNote(user!.uid, input),
    onSuccess: (newNote: Note) => {
      queryClient.setQueryData<Note[]>(
        [NOTES_QUERY_KEY, user?.uid],
        (prev) => [newNote, ...(prev ?? [])]
      )
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, user?.uid] })
    },
  })
}

export function useUpdateNote() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<NoteInput> }) =>
      api.updateNote(user!.uid, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, user?.uid] })
    },
  })
}

export function useDeleteNote() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteNote(user!.uid, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, user?.uid] })
    },
  })
}
