import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'

export default function Customers() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiGet('/api/customers')
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
    return <p className="load-error">Could not load customers: {error}</p>
  }

  if (!rows) return <p className="page-loading">Loading…</p>

  return (
    <div className="stack">
      <h2 className="section-title">Customers</h2>
      <p className="hint">
        Customers who booked published tours.
      </p>
      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Tour / date</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Notes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.customer}>
                <td>{row.customer}</td>
                <td>{row.tourDate}</td>
                <td>{row.address}</td>
                <td>{row.phone}</td>
                <td>{row.condition}</td>
                <td>{row.status}</td>
              </tr>
            ))}
            {rows.length ? null : (
              <tr>
                <td colSpan={6} style={{ color: 'var(--muted)' }}>
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
