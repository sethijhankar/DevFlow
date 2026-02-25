import type { Note } from './types'

interface NoteCardProps {
  note: Note
  projectTitle?: string | null
  isSelected?: boolean
  onClick: () => void
}

export function NoteCard({
  note,
  projectTitle,
  isSelected,
  onClick,
}: NoteCardProps) {
  const excerpt = note.content.slice(0, 120).replace(/\n/g, ' ')
  const date = note.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
        isSelected
          ? 'border-gray-300 bg-gray-100'
          : 'border-transparent hover:bg-gray-50'
      }`}
    >
      <h3 className="truncate font-medium text-gray-900">{note.title || 'Untitled'}</h3>
      {excerpt && (
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{excerpt}</p>
      )}
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {note.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
        {projectTitle && (
          <span className="text-xs text-blue-600">{projectTitle}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">{date}</p>
    </button>
  )
}
