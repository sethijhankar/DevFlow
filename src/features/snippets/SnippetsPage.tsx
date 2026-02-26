import { useMemo, useState } from 'react'
import {
  useSnippets,
  useCreateSnippet,
  useUpdateSnippet,
  useDeleteSnippet,
} from './hooks'
import { SnippetCard } from './SnippetCard'
import { SnippetForm } from './SnippetForm'
import { SnippetModal } from './SnippetModal'
import type { Snippet, SnippetInput } from './types'

export function SnippetsPage() {
  const { data: snippets = [], isLoading, error } = useSnippets()
  const createSnippet = useCreateSnippet()
  const updateSnippet = useUpdateSnippet()
  const deleteSnippet = useDeleteSnippet()

  const [modal, setModal] = useState<'create' | Snippet | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Snippet | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [search, setSearch] = useState('')

  const filteredSnippets = useMemo(() => {
    let list = snippets
    if (favoritesOnly) list = list.filter((s) => s.favorite)
    if (tagFilter) list = list.filter((s) => s.tags.includes(tagFilter))
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [snippets, tagFilter, favoritesOnly, search])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    snippets.forEach((s) => s.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [snippets])

  const handleSubmit = (input: SnippetInput) => {
    if (modal === 'create') {
      createSnippet.mutate(input, { onSuccess: () => setModal(null) })
    } else if (modal && typeof modal === 'object') {
      updateSnippet.mutate(
        { id: modal.id, input },
        { onSuccess: () => setModal(null) }
      )
    }
  }

  const handleToggleFavorite = (snippet: Snippet) => {
    updateSnippet.mutate({
      id: snippet.id,
      input: { favorite: !snippet.favorite },
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
        Failed to load snippets. Check Firestore rules and try again.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Snippets</h2>
        <button
          type="button"
          onClick={() => setModal('create')}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 active:bg-gray-700 sm:w-auto"
        >
          Add snippet
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="min-h-[2.5rem] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:min-w-[12rem]"
        />
        <select
          value={tagFilter ?? ''}
          onChange={(e) => setTagFilter(e.target.value || null)}
          className="min-h-[2.5rem] rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
        >
          <option value="">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm text-gray-700">Favorites only</span>
        </label>
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center">
          <p className="text-gray-600">
            {snippets.length === 0
              ? 'No snippets yet.'
              : 'No snippets match filters.'}
          </p>
          {snippets.length === 0 && (
            <button
              type="button"
              onClick={() => setModal('create')}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              Add your first snippet
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={(s) => setModal(s)}
              onDelete={setDeleteTarget}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {modal !== null && (
        <SnippetModal
          title={modal === 'create' ? 'New snippet' : 'Edit snippet'}
          onClose={() => setModal(null)}
        >
          <SnippetForm
            snippet={typeof modal === 'object' ? modal : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setModal(null)}
            isSubmitting={createSnippet.isPending || updateSnippet.isPending}
          />
        </SnippetModal>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <p className="text-gray-700">
              Delete <strong>{deleteTarget.title}</strong>? This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  deleteSnippet.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  })
                }
                disabled={deleteSnippet.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteSnippet.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
