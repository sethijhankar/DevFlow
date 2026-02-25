import { useState, useEffect } from 'react'
import type { PreferencesSettings } from '../types'

interface PreferencesSectionProps {
  data: PreferencesSettings
  onSave: (data: PreferencesSettings) => void
  isSaving: boolean
}

export function PreferencesSection({ data, onSave, isSaving }: PreferencesSectionProps) {
  const [language, setLanguage] = useState(data.language)
  const [dateFormat, setDateFormat] = useState(data.dateFormat)
  const [weekStartsOn, setWeekStartsOn] = useState(data.weekStartsOn)

  useEffect(() => {
    setLanguage(data.language)
    setDateFormat(data.dateFormat)
    setWeekStartsOn(data.weekStartsOn)
  }, [data.language, data.dateFormat, data.weekStartsOn])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ language, dateFormat, weekStartsOn })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date format</label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="MM/dd/yyyy">MM/DD/YYYY</option>
          <option value="dd/MM/yyyy">DD/MM/YYYY</option>
          <option value="yyyy-MM-dd">YYYY-MM-DD</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Week starts on</label>
        <select
          value={weekStartsOn}
          onChange={(e) => setWeekStartsOn(e.target.value as PreferencesSettings['weekStartsOn'])}
          className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="monday">Monday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
