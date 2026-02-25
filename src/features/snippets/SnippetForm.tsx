import { useState, useEffect } from 'react'
import type { Snippet, SnippetInput, SnippetLanguage } from './types'
import { SNIPPET_LANGUAGES } from './types'

const defaultInput: SnippetInput = {
  title: '',
  language: 'plaintext',
  code: '',
  tags: [],
  favorite: false,
}

interface SnippetFormProps {
  snippet?: Snippet | null
  onSubmit: (input: SnippetInput) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function SnippetForm({
  snippet,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SnippetFormProps) {
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState<SnippetLanguage>('plaintext')
  const [code, setCode] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title)
      setLanguage(snippet.language)
      setCode(snippet.code)
      setTagsStr(snippet.tags.join(', '))
      setFavorite(snippet.favorite)
    } else {
      setTitle(defaultInput.title)
      setLanguage(defaultInput.language)
      setCode(defaultInput.code)
      setTagsStr('')
      setFavorite(defaultInput.favorite)
    }
  }, [snippet])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    onSubmit({
      title: title.trim() || 'Untitled',
      language,
      code,
      tags,
      favorite,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Snippet name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SnippetLanguage)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SNIPPET_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-gray-700">Favorite</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Paste or type your code..."
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="react, hooks, utils"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : snippet ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
