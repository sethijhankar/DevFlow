import { useState, useEffect } from 'react'
import type { ProfileSettings } from '../types'

interface ProfileSectionProps {
  data: ProfileSettings
  onSave: (data: ProfileSettings) => void
  isSaving: boolean
}

export function ProfileSection({ data, onSave, isSaving }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState(data.displayName)
  const [bio, setBio] = useState(data.bio)
  const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl)

  useEffect(() => {
    setDisplayName(data.displayName)
    setBio(data.bio)
    setAvatarUrl(data.avatarUrl)
  }, [data.displayName, data.bio, data.avatarUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ displayName, bio, avatarUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Display name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Short bio"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="mt-1 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="https://..."
        />
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
