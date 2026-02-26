import { useMemo, useState, useEffect, useRef } from 'react'
import { useNotes, useCreateNote, useDeleteNote } from './hooks'
import { useProjects } from '@/features/projects/hooks'
import { NoteCard } from './NoteCard'
import { NoteEditor } from './NoteEditor'
import type { Note } from './types'

const CREATE_TIMEOUT_MS = 12_000

export function NotesPage() {
  const { data: notes = [], isLoading, error } = useNotes()
  const { data: projects = [] } = useProjects()
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createTimedOut, setCreateTimedOut] = useState(false)
  const createTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filteredNotes = useMemo(() => {
    let list = notes
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }
    if (tagFilter) {
      list = list.filter((n) => n.tags.includes(tagFilter))
    }
    if (projectFilter) {
      list = list.filter((n) => n.projectId === projectFilter)
    }
    return list
  }, [notes, search, tagFilter, projectFilter])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [notes])

  const selectedNote = selectedId
    ? notes.find((n) => n.id === selectedId)
    : null
  const projectTitle = (id: string | null) =>
    id ? projects.find((p) => p.id === id)?.title ?? null : null

  useEffect(() => {
    return () => {
      if (createTimeoutRef.current) clearTimeout(createTimeoutRef.current)
    }
  }, [])

  const handleNewNote = () => {
    setCreateTimedOut(false)
    createNote.reset()
    setIsCreating(true)
    if (createTimeoutRef.current) clearTimeout(createTimeoutRef.current)
    createTimeoutRef.current = setTimeout(() => {
      if (createNote.isPending) {
        setCreateTimedOut(true)
        setIsCreating(false)
      }
      createTimeoutRef.current = null
    }, CREATE_TIMEOUT_MS)
    createNote.mutate(
      {
        title: 'Untitled',
        content: '',
        tags: [],
        projectId: null,
      },
      {
        onSuccess: (newNote) => {
          if (createTimeoutRef.current) {
            clearTimeout(createTimeoutRef.current)
            createTimeoutRef.current = null
          }
          setCreateTimedOut(false)
          setSelectedId(newNote.id)
          setIsCreating(false)
        },
        onError: () => {
          if (createTimeoutRef.current) {
            clearTimeout(createTimeoutRef.current)
            createTimeoutRef.current = null
          }
          setCreateTimedOut(false)
          setIsCreating(false)
        },
      }
    )
  }

  const handleDelete = (note: Note) => {
    deleteNote.mutate(note.id, {
      onSuccess: () => {
        if (selectedId === note.id) setSelectedId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load notes. Please try again.
      </div>
    )
  }

  const showListOnMobile = !selectedNote
  const showEditorOnMobile = !!selectedNote

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4 lg:h-[calc(100vh-8rem)] lg:flex-row lg:gap-4">
      {/* List: on mobile hidden when a note is selected */}
      <aside
        className={`flex min-h-0 w-full flex-col rounded-lg border border-gray-200 bg-white lg:w-72 lg:shrink-0 lg:border-r ${
          showListOnMobile ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 sm:px-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Notes</h2>
          <button
            type="button"
            onClick={handleNewNote}
            disabled={isCreating || createNote.isPending}
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 active:bg-gray-700"
          >
            {createNote.isPending || isCreating ? 'Creating…' : 'New note'}
          </button>
        </div>
        {(createNote.isError || createTimedOut) && (
          <div className="mx-2 mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
            {createTimedOut
              ? 'Create timed out. Check the browser console (F12) and Firestore rules.'
              : 'Could not create note. Check Firestore rules and try again.'}
            <button
              type="button"
              onClick={() => { setCreateTimedOut(false); createNote.reset() }}
              className="mt-1 block font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="mx-2 mt-2 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="mt-2 flex flex-wrap gap-2 px-2">
          <select
            value={tagFilter ?? ''}
            onChange={(e) => setTagFilter(e.target.value || null)}
            className="min-h-[2.25rem] rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600"
          >
            <option value="">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={projectFilter ?? ''}
            onChange={(e) => setProjectFilter(e.target.value || null)}
            className="min-h-[2.25rem] rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {filteredNotes.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              {notes.length === 0
                ? 'No notes yet. Create one above.'
                : 'No notes match filters.'}
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  projectTitle={projectTitle(note.projectId)}
                  isSelected={selectedId === note.id}
                  onClick={() => setSelectedId(note.id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Editor: on mobile full width when note selected, with back button */}
      <section
        className={`min-h-0 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white ${
          showEditorOnMobile ? 'flex flex-col' : 'hidden lg:flex'
        }`}
      >
        {selectedNote ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="flex w-full items-center gap-2 border-b border-gray-200 px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 lg:hidden"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to notes
            </button>
            <div className="min-h-0 flex-1 overflow-auto">
              <NoteEditor
                note={selectedNote}
                onDelete={handleDelete}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-gray-500">
            <p className="text-center text-sm">
              Select a note or create a new one to start writing.
            </p>
            <button
              type="button"
              onClick={handleNewNote}
              disabled={isCreating || createNote.isPending}
              className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 active:bg-gray-700"
            >
              {createNote.isPending || isCreating ? 'Creating…' : 'New note'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
