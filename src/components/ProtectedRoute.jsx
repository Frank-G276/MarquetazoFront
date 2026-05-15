import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ children, adminOnly = false, managerOnly = false }) {
  const { user, loading, isAdmin, isManager } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-ink/60">Comprobando sesión…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (managerOnly && !isManager) {
    return <Navigate to="/" replace />
  }

  return children
}
