import { useMemo, useState } from 'react'

import MapModal from './MapModal'
import { apiPost } from '../api/client'

export default function RegisterCreatorModal({ onClose, onRegistered }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [address, setAddress] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const addressLabel = useMemo(() => {
    if (!address) return ''
    const line1 = address.address_line1 || ''
    const city = address.city || ''
    return [line1, city].filter(Boolean).join(', ')
  }, [address])

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      await apiPost('/api/auth/register', {
        username,
        password,
        email,
        firstName,
        surname,
        phoneNumber,
        address,
      })

      // Close popup after successful registration (no error).
      onRegistered?.()
      onClose?.()
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="creator-modal-header">
          <h2 className="section-title" style={{ margin: 0 }}>
            Register as creator
          </h2>
          <button type="button" className="creator-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error ? <p className="load-error compact">{error}</p> : null}

          <div className="field-row">
            <label className="field">
              <span>Username</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field">
              <span>Phone number</span>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Surname</span>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </label>
          </div>

          <div className="field">
            <span>Address (optional)</span>
            <div className="btn-group" style={{ marginBottom: 16 }}>
              <button
                type="button"
                className="btn secondary small"
                onClick={() => setShowMap(true)}
              >
                Select on map
              </button>
              {address ? (
                <button
                  type="button"
                  className="btn ghost small"
                  onClick={() => setAddress(null)}
                >
                  Clear
                </button>
              ) : null}
            </div>

            {address ? (
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                Selected: {addressLabel}
              </div>
            ) : (
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                No address selected.
              </div>
            )}
          </div>

          <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn ghost"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={busy}
            >
              {busy ? 'Registering…' : 'Register'}
            </button>
          </div>
        </form>
      </div>

      {showMap ? (
        <MapModal
          onClose={() => setShowMap(false)}
          onConfirm={(addressData) => {
            setAddress(addressData)
            setShowMap(false)
          }}
        />
      ) : null}
    </div>
  )
}

