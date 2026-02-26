import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/notes', label: 'Notes', end: false },
  { to: '/snippets', label: 'Snippets', end: false },
  { to: '/analytics', label: 'Analytics', end: false },
  { to: '/settings', label: 'Settings', end: false },
] as const

function NavContent({
  onNavigate,
  userLabel,
  userEmail,
  signOut,
}: {
  onNavigate?: () => void
  userLabel: string
  userEmail: string
  signOut: () => void
}) {
  return (
    <>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }: { isActive: boolean }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
        <p className="truncate px-2 text-xs text-gray-500" title={userEmail}>
          {userLabel}
        </p>
        <button
          type="button"
          onClick={() => {
            onNavigate?.()
            signOut()
          }}
          className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </>
  )
}

export function SidebarLayout() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const userLabel = user?.displayName?.trim() || user?.email || ''
  const userEmail = user?.email ?? ''

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-gray-50">
      {/* Mobile: overlay when drawer is open */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar: drawer on mobile, fixed column on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-200 ease-out md:relative md:inset-auto md:z-0 md:w-56 md:max-w-none md:translate-x-0 md:shadow-none ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4 md:justify-start">
          <span className="text-lg font-semibold text-gray-900">DevFlow</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavContent onNavigate={closeMenu} userLabel={userLabel} userEmail={userEmail} signOut={signOut} />
      </aside>

      {/* Main: top bar on mobile with hamburger */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="-ml-1 rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="truncate text-base font-medium text-gray-900">
            {navItems.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label ?? 'DevFlow'}
          </span>
        </header>

        <main className="min-w-0 flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
