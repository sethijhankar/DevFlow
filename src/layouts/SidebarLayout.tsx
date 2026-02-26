import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/context'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/notes', label: 'Notes', end: false },
  { to: '/snippets', label: 'Snippets', end: false },
  { to: '/analytics', label: 'Analytics', end: false },
  { to: '/settings', label: 'Settings', end: false },
] as const

export function SidebarLayout() {
  const { user, signOut } = useAuth()
  const userLabel = user?.displayName?.trim() || user?.email || ''

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <span className="text-lg font-semibold text-gray-900">DevFlow</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }: { isActive: boolean }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-3">
          <p className="truncate px-2 text-xs text-gray-500" title={user?.email ?? ''}>
            {userLabel}
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  )
}
