import { useState, useEffect } from 'react'
import type { IntegrationsSettings } from '../types'

interface P {
  data: IntegrationsSettings
  onSave: (d: IntegrationsSettings) => void
  isSaving: boolean
}

export function IntegrationsSection({ data, onSave, isSaving }: P) {
  const [githubUsername, setGithubUsername] = useState(data.githubUsername)
  const [webhookUrl, setWebhookUrl] = useState(data.webhookUrl)

  useEffect(() => {
    setGithubUsername(data.githubUsername)
    setWebhookUrl(data.webhookUrl)
  }, [data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...data, githubUsername, webhookUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">GitHub username</label>
        <input type="text" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} className="mt-1 max-w-md rounded-lg border px-3 py-2 text-sm" placeholder="username" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
        <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="mt-1 max-w-md rounded-lg border px-3 py-2 text-sm" placeholder="https://..." />
      </div>
      <button type="submit" disabled={isSaving} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50">
        {isSaving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
