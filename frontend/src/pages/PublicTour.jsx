import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost } from '../api/client'

function formatDateLabel(dateValue) {
  const d = dateValue ? new Date(dateValue) : null
  if (!d || Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PublicTour() {
  const { tourId } = useParams()
  const { user } = useAuth()

  const [tour, setTour] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  // For now, anyone can submit reviews (author input below).
  // Later: add a separate login for customers/users (non-creators), as noted in `update/change`.
  const [author, setAuthor] = useState(user?.name ?? '')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitError, setSubmitError] = useState(null)

  async function load() {
    setError(null)
    const [t, r] = await Promise.all([
      apiGet(`/api/tours/${tourId}`),
      apiGet(`/api/tours/${tourId}/reviews`),
    ])
    setTour(t)
    setReviews(r)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setBusy(true)
        await load()
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load tour')
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId])

  useEffect(() => {
    // Prefill author when a logged-in user appears.
    if (user?.name && !author) setAuthor(user.name)
  }, [user, author])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)

    try {
      setBusy(true)
      await apiPost(`/api/tours/${tourId}/reviews`, {
        author,
        rating,
        text,
      })
      setText('')
      setRating(5)
      await load()
    } catch (e) {
      setSubmitError(e.message || 'Could not submit review')
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <div className="stack">
        <p className="load-error">Could not load tour: {error}</p>
      </div>
    )
  }

  if (busy || !tour) return <p className="page-loading">Loading…</p>

  return (
    <div className="stack">
      <section className="card">
        <h2 className="section-title" style={{ marginTop: 0 }}>
          {tour.title}
        </h2>
        <p className="hint" style={{ marginBottom: 16 }}>
          {tour.destination}
          {tour.category ? ` · ${tour.category}` : ''} · {tour.dateLabel}
        </p>

        {tour.shortDesc ? <p>{tour.shortDesc}</p> : null}
        {tour.highlights ? <p style={{ marginTop: 12 }}>{tour.highlights}</p> : null}

        <div className="card" style={{ background: 'var(--surface2)' }}>
          <p style={{ margin: 0 }}>
            Price per person:{' '}
            {tour.pricePerPerson != null ? `฿${tour.pricePerPerson}` : '—'}
          </p>
          <p style={{ margin: '8px 0 0' }}>
            Max travelers:{' '}
            {tour.maxTravelers != null ? `${tour.maxTravelers}` : '—'}
          </p>
          {tour.tourGuide ? (
            <p style={{ margin: '8px 0 0' }}>Guide: {tour.tourGuide}</p>
          ) : null}
        </div>
      </section>

      {tour.itinerary?.length ? (
        <section className="card">
          <h2 className="section-title" style={{ marginTop: 0 }}>
            Itinerary
          </h2>
          <ul className="itinerary-list">
            {tour.itinerary.map((d, i) => (
              <li key={`${d.title}-${i}`} className="itinerary-item card inner">
                <div className="itinerary-item-head">
                  <span>Day {i + 1}</span>
                  <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
                    {d.date ? formatDateLabel(d.date) : ''}
                  </span>
                </div>
                {d.title ? <div style={{ fontWeight: 700 }}>{d.title}</div> : null}
                {d.description ? <p style={{ margin: '8px 0 0' }}>{d.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card">
        <div className="section-head" style={{ marginBottom: 8 }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Reviews
          </h2>
          {tour.reviewStats?.reviewCount ? (
            <span className="pill pill-muted">
              {tour.reviewStats.averageRating != null
                ? `${tour.reviewStats.averageRating.toFixed(1)}/${5}`
                : `0/${5}`}
            </span>
          ) : null}
        </div>

        <p className="hint">
          For now, anyone can submit a review. Later, a separate login for regular users (non-creators) can be added.
        </p>

        <form onSubmit={handleSubmit} className="card" style={{ background: 'var(--surface2)', marginTop: 12 }}>
          {submitError ? <p className="load-error compact">{submitError}</p> : null}
          <div className="field-row">
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Your name</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </label>
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Rating (1-5)</span>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Review</span>
            <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <div className="wizard-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="btn primary" type="submit" disabled={busy || !tourId}>
              {busy ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 16 }}>
          {reviews.length ? (
            <ul className="itinerary-list" style={{ gap: 10 }}>
              {reviews.map((r) => (
                <li key={r.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ fontWeight: 700 }}>{r.author}</div>
                    <div style={{ color: 'var(--muted)', fontWeight: 600 }}>
                      Rating: {r.rating}/5
                    </div>
                  </div>
                  {r.text ? <p style={{ margin: '10px 0 0' }}>{r.text}</p> : null}
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8 }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="hint" style={{ marginTop: 8 }}>
              No reviews yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

