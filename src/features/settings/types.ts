export interface ProfileSettings {
  displayName: string
  bio: string
  avatarUrl: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface AppearanceSettings {
  theme: Theme
  compactSidebar: boolean
}

export interface NotificationsSettings {
  emailDigest: boolean
  emailFrequency: 'off' | 'daily' | 'weekly'
  inAppEnabled: boolean
}

export interface IntegrationsSettings {
  githubConnected: boolean
  githubUsername: string
  webhookUrl: string
}

export interface AiSettings {
  summaryModel: string
  summaryEnabled: boolean
}

export interface PreferencesSettings {
  language: string
  dateFormat: string
  weekStartsOn: 'sunday' | 'monday'
}

export interface UserSettings {
  profile: ProfileSettings
  appearance: AppearanceSettings
  notifications: NotificationsSettings
  integrations: IntegrationsSettings
  ai: AiSettings
  preferences: PreferencesSettings
  updatedAt: string
}

const defaultProfile: ProfileSettings = {
  displayName: '',
  bio: '',
  avatarUrl: '',
}
const defaultAppearance: AppearanceSettings = {
  theme: 'system',
  compactSidebar: false,
}
const defaultNotifications: NotificationsSettings = {
  emailDigest: false,
  emailFrequency: 'off',
  inAppEnabled: true,
}
const defaultIntegrations: IntegrationsSettings = {
  githubConnected: false,
  githubUsername: '',
  webhookUrl: '',
}
const defaultAi: AiSettings = {
  summaryModel: 'openai/gpt-4o-mini',
  summaryEnabled: true,
}
const defaultPreferences: PreferencesSettings = {
  language: 'en',
  dateFormat: 'MM/dd/yyyy',
  weekStartsOn: 'monday',
}

export const defaultSettings = {
  profile: defaultProfile,
  appearance: defaultAppearance,
  notifications: defaultNotifications,
  integrations: defaultIntegrations,
  ai: defaultAi,
  preferences: defaultPreferences,
}
