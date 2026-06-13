import { useAuth } from '../auth/AuthContext'
import Seal from './Seal'

export default function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className="sidebar">
      <div className="side-head">
        <Seal size={38} />
        <div className="wm">
          <div className="l1">Sri Lanka Police</div>
          <div className="l2">Traffic Fine Portal</div>
        </div>
      </div>

      <nav className="side-nav">
        <div className="nav-label">Monitoring</div>
        <div className="nav-item active"><span>Dashboard</span></div>
        {/* Future sections can be added here, e.g. Reports, Districts */}
      </nav>

      <div className="side-foot">
        <div className="who">
          <div className="av">A</div>
          <div>
            <div className="l1">Administrator</div>
            <div className="l2">Senior Official</div>
          </div>
        </div>
        <button className="logout" onClick={logout}><span>Sign out</span></button>
      </div>
    </aside>
  )
}
