import { useState, useEffect } from 'react'
import type { AiSettings } from '../types'

const MODELS = ['openai/gpt-4o-mini', 'openai/gpt-4o', 'anthropic/claude-3-haiku', 'anthropic/claude-3-sonnet']

interface AiSectionProps {
  data: AiSettings
  onSave: (data: AiSettings) => void
  isSaving: boolean
}

export function AiSection({ data, onSave, isSaving }: AiSectionProps) {
  const [summaryModel, setSummaryModel] = useState(data.summaryModel)
  const [summaryEnabled, setSummaryEnabled] = useState(data.summaryEnabled)

  useEffect(() => {
    setSummaryModel(data.summaryModel)
    setSummaryEnabled(data.summaryEnabled)
  }, [data.summaryModel, data.summaryEnabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ summaryModel, summaryEnabled })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="summaryEnabled"
          checked={summaryEnabled}
          onChange={(e) => setSummaryEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="summaryEnabled" className="text-sm text-gray-700">
          Enable weekly AI summary (OpenRouter)
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Summary model</label>
        <select
          value={summaryModel}
          onChange={(e) => setSummaryModel(e.target.value)}
          className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
