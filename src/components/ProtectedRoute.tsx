import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-gray-900" />
          <p className="mt-3 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user == null) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
