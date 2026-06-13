import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Seal from '../components/Seal'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials. Access is restricted to authorised officials.')
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="login-wrap">
      {/* Official branded panel */}
      <div className="login-brand">
        <div className="brand-top">
          <Seal size={56} />
          <div className="wm">
            <div className="l1">Sri Lanka Police</div>
            <div className="l2">Department of Traffic</div>
          </div>
        </div>

        <div className="brand-mid">
          <div className="kicker">National Traffic Fine System</div>
          <h1>Fine Collection Monitoring Portal</h1>
          <p>
            Centralised oversight of traffic fine settlements across all districts —
            providing senior officials with real-time collection data to support
            transparent and informed decision-making.
          </p>
          <div className="gold-rule" />
        </div>

        <div className="brand-foot">
          <span className="dot" />
          Government of Sri Lanka &nbsp;&bull;&nbsp; Authorised access only
        </div>
      </div>

      {/* Login form */}
      <div className="login-form-side">
        <div className="login-card">
          <div className="form-seal"><Seal size={56} /></div>
          <h2>Official sign in</h2>
          <p className="sub">Enter your credentials to access the portal.</p>

          {error && <div className="error-msg">{error}</div>}

          <div className="field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter password"
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Verifying…' : 'Sign in securely'}
          </button>

          <div className="notice">
            This is a restricted government system. Activity may be monitored and
            recorded. <b>Demo credentials — admin / admin123</b>
          </div>
        </div>
      </div>
    </div>
  )
}
