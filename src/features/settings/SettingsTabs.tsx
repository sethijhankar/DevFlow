const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'ai', label: 'AI' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'danger', label: 'Danger Zone' },
] as const

export type SettingsTabId = (typeof TABS)[number]['id']

interface SettingsTabsProps {
  active: SettingsTabId
  onSelect: (id: SettingsTabId) => void
}

export function SettingsTabs({ active, onSelect }: SettingsTabsProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export { TABS }
