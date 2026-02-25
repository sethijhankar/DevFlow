'use client'
import { useState } from 'react'

interface DangerZoneSectionProps {
  onDeleteData?: () => void
  isDeleting?: boolean
}

export function DangerZoneSection({
  onDeleteData,
  isDeleting = false,
}: DangerZoneSectionProps) {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const canDelete = confirmText.toLowerCase() === 'delete'

  return (
    <div className="space-y-6 rounded-lg border border-red-200 bg-red-50/50 p-4">
      <div>
        <h4 className="text-sm font-semibold text-red-800">Delete my data</h4>
        <p className="mt-1 text-sm text-red-700">
          Permanently delete all your projects, notes, snippets, and settings from
          DevFlow. This cannot be undone. Your account (email) will remain;
          you can sign in again but data will be gone.
        </p>
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete my data
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-red-700">
              Type <strong>delete</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              className="w-full max-w-xs rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => canDelete && onDeleteData?.()}
                disabled={!canDelete || isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Confirm delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
