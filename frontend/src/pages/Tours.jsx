import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/client'

export default function Tours() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiGet('/api/tours')
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
    return <p className="load-error">Could not load tours: {error}</p>
  }

  if (!rows) return <p className="page-loading">Loading…</p>

  return (
    <div className="stack">
      <div className="section-head">
        <h2 className="section-title">Tours</h2>
        <Link to="/tours/new" className="btn primary">
          Create tour
        </Link>
      </div>
      <p className="hint">Published tours only. Sort by date.</p>
      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tour</th>
              <th>Date</th>
              <th>Guide</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Travelers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id ?? `${row.tour}-${row.date}`}>
                <td>
                  <Link to={`/tours/${row.id}`}>{row.tour}</Link>
                </td>
                <td>{row.date}</td>
                <td>{row.guide}</td>
                <td>{row.price}</td>
                <td>{row.cost}</td>
                <td>{row.travelers}</td>
                <td>{row.status}</td>
              </tr>
            ))}
            {rows.length ? null : (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  No published tours yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
