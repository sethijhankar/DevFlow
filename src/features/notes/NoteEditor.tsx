import { useState, useEffect, useRef } from 'react'
import { MarkdownPreview } from './MarkdownPreview'
import { useDebouncedCallback } from './useDebounce'
import { useUpdateNote } from './hooks'
import { useProjects } from '@/features/projects/hooks'
import type { Note, NoteInput } from './types'

const AUTOSAVE_DELAY_MS = 1500

interface NoteEditorProps {
  note: Note
  onDelete?: (note: Note) => void
}

export function NoteEditor({ note, onDelete }: NoteEditorProps) {
  const updateNote = useUpdateNote()
  const { data: projects = [] } = useProjects()

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags)
  const [projectId, setProjectId] = useState<string | null>(note.projectId)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  const noteIdRef = useRef(note.id)
  noteIdRef.current = note.id

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
    setProjectId(note.projectId)
  }, [note.id, note.title, note.content, note.tags, note.projectId])

  const save = useDebouncedCallback((payload: Partial<NoteInput>) => {
    updateNote.mutate({ id: noteIdRef.current, input: payload })
  }, AUTOSAVE_DELAY_MS)

  useEffect(() => {
    save({ title, content, tags, projectId })
  }, [title, content, tags, projectId, save])

  const tagsStr = tags.join(', ')
  const setTagsFromString = (s: string) =>
    setTags(s.split(',').map((t) => t.trim()).filter(Boolean))

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border-0 bg-transparent px-0 py-3 text-xl font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-0"
        />
        <div className="flex flex-wrap items-center gap-2 pb-3">
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsFromString(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="min-h-[2.25rem] rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={projectId ?? ''}
            onChange={(e) => setProjectId(e.target.value || null)}
            className="min-h-[2.25rem] rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          {updateNote.isPending && (
            <span className="text-xs text-gray-400">Saving…</span>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(note)}
              className="ml-auto text-sm text-red-600 hover:underline"
            >
              Delete note
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            activeTab === 'write'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            activeTab === 'preview'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {activeTab === 'write' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note in Markdown..."
            className="min-h-[280px] w-full resize-none border-0 bg-transparent p-4 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 sm:min-h-[400px]"
            spellCheck={false}
          />
        ) : (
          <div className="p-4">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  )
}
