import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiPost } from '../api/client'
import RegisterCreatorModal from '../components/RegisterCreatorModal'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const { user } = await apiPost('/api/auth/login', {
        username: username.trim(),
        password,
      })
      login(user.name)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Tour manager</h1>
        <p className="login-sub">Sign in to your account</p>
        {error ? <p className="load-error compact">{error}</p> : null}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email or username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="username"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn primary block" disabled={busy}>
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="login-links">
          <button type="button" className="link-btn">
            Forgot password
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => setShowRegister(true)}
            disabled={busy}
          >
            Register new account
          </button>
        </div>
        <p className="login-demo">Sign in to publish and manage tours.</p>
      </div>
      </div>
      {showRegister ? (
        <RegisterCreatorModal
          onClose={() => setShowRegister(false)}
          onRegistered={() => {
            // Keep user on login; they can now sign in.
          }}
        />
      ) : null}
    </>
  )
}
