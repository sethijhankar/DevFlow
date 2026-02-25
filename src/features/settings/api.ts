import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserSettings } from './types'
import { defaultSettings } from './types'

const SETTINGS_DOC_ID = 'main'

function settingsRef(userId: string) {
  return doc(db, 'users', userId, 'settings', SETTINGS_DOC_ID)
}

function mergeSection<T extends Record<string, unknown>>(
  data: unknown,
  defaults: T
): T {
  if (data == null || typeof data !== 'object' || Array.isArray(data))
    return defaults
  return { ...defaults, ...(data as Record<string, unknown>) } as T
}

function toSettings(data: Record<string, unknown> | null): UserSettings {
  if (!data) {
    return {
      ...defaultSettings,
      updatedAt: '',
    }
  }
  const d = data
  const updatedAt =
    (d.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? ''
  return {
    profile: mergeSection(d.profile, defaultSettings.profile),
    appearance: mergeSection(d.appearance, defaultSettings.appearance),
    notifications: mergeSection(d.notifications, defaultSettings.notifications),
    integrations: mergeSection(d.integrations, defaultSettings.integrations),
    ai: mergeSection(d.ai, defaultSettings.ai),
    preferences: mergeSection(d.preferences, defaultSettings.preferences),
    updatedAt,
  }
}

export async function fetchSettings(userId: string): Promise<UserSettings> {
  const snap = await getDoc(settingsRef(userId))
  return toSettings(snap.exists() ? (snap.data() as Record<string, unknown>) : null)
}

export async function updateSettings(
  userId: string,
  patch: Partial<UserSettings>
): Promise<void> {
  const ref = settingsRef(userId)
  const snap = await getDoc(ref)
  const current = toSettings(snap.exists() ? (snap.data() as Record<string, unknown>) : null)
  const next = { ...current, ...patch }
  await setDoc(ref, {
    profile: next.profile,
    appearance: next.appearance,
    notifications: next.notifications,
    integrations: next.integrations,
    ai: next.ai,
    preferences: next.preferences,
    updatedAt: serverTimestamp(),
  })
}
