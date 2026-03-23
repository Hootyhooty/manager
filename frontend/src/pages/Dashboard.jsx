import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/client'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    apiGet('/api/dashboard')
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p className="load-error">
        Could not load dashboard: {error}. Is the backend running on port
        3001?
      </p>
    )
  }

  if (!data) return <p className="page-loading">Loading…</p>

  const { summaryStats, recentTours, recentBookings, revenueSummary } = data

  return (
    <div className="stack">
      <section>
        <h2 className="section-title">Summary</h2>
        <div className="card-grid">
          <div className="stat-card">
            <span className="stat-label">Total tours</span>
            <span className="stat-value">{summaryStats.totalTours}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bookings</span>
            <span className="stat-value">{summaryStats.bookings}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">{summaryStats.revenue}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Users</span>
            <span className="stat-value">{summaryStats.users}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">Recent tours</h2>
          <Link to="/tours" className="text-link">
            View all
          </Link>
        </div>
        <div className="table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Date</th>
                <th>Guide</th>
                <th>Travelers</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTours.map((row) => (
                <tr key={`${row.tour}-${row.date}`}>
                  <td>
                    <Link to={`/tours/${row.id}`}>{row.tour}</Link>
                  </td>
                  <td>{row.date}</td>
                  <td>{row.guide}</td>
                  <td>{row.travelers}</td>
                  <td>
                    <span className={`pill ${pillClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentTours.length ? null : (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--muted)' }}>
                    No published tours yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="hint">Sort by date.</p>
      </section>

      <section>
        <h2 className="section-title">Recent bookings</h2>
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
              {recentBookings.map((row) => (
                <tr key={row.customer + row.tour}>
                  <td>{row.customer}</td>
                  <td>{row.tour}</td>
                  <td>{row.date}</td>
                  <td>{row.travelers}</td>
                  <td>
                    <span className={`pill ${pillClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length ? null : (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--muted)' }}>
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="hint">Sort by date.</p>
      </section>

      <section>
        <h2 className="section-title">Revenue summary</h2>
        <div className="card revenue-card">
          <p>Revenue this month: {revenueSummary.thisMonth}</p>
          <p>Pending payments: {revenueSummary.pending}</p>
          <p>Refunds: {revenueSummary.refunds}</p>
        </div>
      </section>
    </div>
  )
}

function pillClass(status) {
  const s = status.toLowerCase()
  if (s.includes('open')) return 'pill-info'
  if (s.includes('full')) return 'pill-warn'
  if (s.includes('confirm')) return 'pill-success'
  if (s.includes('pending')) return 'pill-muted'
  return ''
}
