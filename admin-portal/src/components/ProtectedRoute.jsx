import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

// Wraps any page that should only be reachable when logged in.
export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}
