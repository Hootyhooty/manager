import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'

export default function Guides() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiGet('/api/guides')
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
    return <p className="load-error">Could not load guides: {error}</p>
  }

  if (!rows) return <p className="page-loading">Loading…</p>

  return (
    <div className="stack">
      <div className="section-head">
        <h2 className="section-title">Guides</h2>
        <button type="button" className="btn secondary">
          Add tour guide
        </button>
      </div>
      <p className="hint">Guides associated with published tours.</p>
      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guide</th>
              <th>Tours / cost</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.toursCost}</td>
                <td>{row.address}</td>
                <td>{row.phone}</td>
                <td>{row.status}</td>
                <td>{row.remark}</td>
              </tr>
            ))}
            {rows.length ? null : (
              <tr>
                <td colSpan={6} style={{ color: 'var(--muted)' }}>
                  No guides yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
