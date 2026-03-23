import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'

export default function Bookings() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiGet('/api/bookings')
      .then((list) => {
        if (!cancelled) setRows(list)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return <p className="load-error">Could not load bookings: {error}</p>
  }

  if (!rows) return <p className="page-loading">Loading…</p>

  return (
    <div className="stack">
      <h2 className="section-title">Bookings</h2>
      <p className="hint">Published tours only.</p>
      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Tour</th>
              <th>Date</th>
              <th>Travelers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.customer + row.tour}>
                <td>{row.customer}</td>
                <td>{row.tour}</td>
                <td>{row.date}</td>
                <td>{row.travelers}</td>
                <td>{row.status}</td>
              </tr>
            ))}
            {rows.length ? null : (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
