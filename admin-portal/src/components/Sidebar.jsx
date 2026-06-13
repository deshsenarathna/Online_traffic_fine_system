import { useAuth } from '../auth/AuthContext'

export default function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-badge">SLP</div>
        <div className="brand-text">
          Fine Monitor
          <small>Admin Portal</small>
        </div>
      </div>

      <div className="nav-item active"><span>Dashboard</span></div>
      {/* Add more routes here later, e.g. Reports, Districts, Settings */}

      <button className="logout" onClick={logout}><span>Sign out</span></button>
    </aside>
  )
}
