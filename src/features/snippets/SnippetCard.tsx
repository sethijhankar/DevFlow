import { CodeBlock } from './CodeBlock'
import type { Snippet } from './types'

interface SnippetCardProps {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (snippet: Snippet) => void
  onToggleFavorite: (snippet: Snippet) => void
}

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SnippetCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 p-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">{snippet.title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{snippet.language}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(snippet)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-500"
            title={snippet.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={snippet.favorite ? 'Unfavorite' : 'Favorite'}
          >
            {snippet.favorite ? (
              <svg className="h-5 w-5 fill-amber-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => onEdit(snippet)}
            className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(snippet)}
            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="p-3">
        <CodeBlock
          code={snippet.code}
          language={snippet.language}
          showCopy
          maxHeight="10rem"
        />
      </div>
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 px-3 pb-3 pt-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
