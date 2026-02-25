import { useState, useEffect } from 'react'
import type { NotificationsSettings } from '../types'

interface NotificationsSectionProps {
  data: NotificationsSettings
  onSave: (data: NotificationsSettings) => void
  isSaving: boolean
}

export function NotificationsSection(props: NotificationsSectionProps) {
  const { data, onSave, isSaving } = props
  const [emailDigest, setEmailDigest] = useState(data.emailDigest)
  const [emailFrequency, setEmailFrequency] = useState(data.emailFrequency)
  const [inAppEnabled, setInAppEnabled] = useState(data.inAppEnabled)

  useEffect(() => {
    setEmailDigest(data.emailDigest)
    setEmailFrequency(data.emailFrequency)
    setInAppEnabled(data.inAppEnabled)
  }, [data.emailDigest, data.emailFrequency, data.inAppEnabled])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ emailDigest, emailFrequency, inAppEnabled })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="emailDigest"
          checked={emailDigest}
          onChange={(e) => setEmailDigest(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="emailDigest" className="text-sm text-gray-700">
          Email digest
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email frequency
        </label>
        <select
          value={emailFrequency}
          onChange={(e) => setEmailFrequency(e.target.value as 'off' | 'daily' | 'weekly')}
          className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="off">Off</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inAppEnabled"
          checked={inAppEnabled}
          onChange={(e) => setInAppEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="inAppEnabled" className="text-sm text-gray-700">
          In-app notifications
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
