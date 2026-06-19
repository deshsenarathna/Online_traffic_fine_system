import { NavLink } from 'react-router-dom'
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
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span>Dashboard</span>
        </NavLink>
        <div className="nav-label" style={{ marginTop: 16 }}>Administration</div>
        <NavLink to="/officers" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span>Officers</span>
        </NavLink>
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
