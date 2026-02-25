import { useState, useEffect } from 'react'
import type { AppearanceSettings, Theme } from '../types'

interface AppearanceSectionProps {
  data: AppearanceSettings
  onSave: (data: AppearanceSettings) => void
  isSaving: boolean
}

export function AppearanceSection({ data, onSave, isSaving }: AppearanceSectionProps) {
  const [theme, setTheme] = useState<Theme>(data.theme)
  const [compactSidebar, setCompactSidebar] = useState(data.compactSidebar)

  useEffect(() => {
    setTheme(data.theme)
    setCompactSidebar(data.compactSidebar)
  }, [data.theme, data.compactSidebar])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ theme, compactSidebar })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="compactSidebar"
          checked={compactSidebar}
          onChange={(e) => setCompactSidebar(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="compactSidebar" className="text-sm text-gray-700">
          Compact sidebar
        </label>
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
