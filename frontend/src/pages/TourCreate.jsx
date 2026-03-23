import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../api/client'
import { useAuth } from '../context/AuthContext'

function newDayId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `d-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const initialDay = () => ({
  id: newDayId(),
  date: '',
  title: '',
  description: '',
})

export default function TourCreate() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const metaOnce = useRef(false)
  const [step, setStep] = useState(1)

  const [destinations, setDestinations] = useState([])
  const [categories, setCategories] = useState([])
  const [guideNames, setGuideNames] = useState([])
  const [metaError, setMetaError] = useState(null)

  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [category, setCategory] = useState('')
  const [days, setDays] = useState(3)
  const [nights, setNights] = useState(2)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [shortDesc, setShortDesc] = useState('')

  const [highlights, setHighlights] = useState('')
  const [hotel, setHotel] = useState('')
  const [transport, setTransport] = useState('')
  const [guideAgency, setGuideAgency] = useState('')
  const [contact, setContact] = useState('')
  const [other, setOther] = useState('')

  const [itinerary, setItinerary] = useState([initialDay()])

  const [galleryNote, setGalleryNote] = useState('')

  const [price, setPrice] = useState('')
  const [maxTravelers, setMaxTravelers] = useState('')
  const [tourGuide, setTourGuide] = useState('')

  const [publishBusy, setPublishBusy] = useState(false)
  const [publishError, setPublishError] = useState(null)

  useEffect(() => {
    apiGet('/api/meta')
      .then((m) => {
        setDestinations(m.destinations)
        setCategories(m.categories)
        setGuideNames(m.guideNames)
        if (!metaOnce.current) {
          metaOnce.current = true
          setDestination(m.destinations[0] ?? '')
          setCategory(m.categories[0] ?? '')
          setTourGuide(m.guideNames[0] ?? '')
        }
      })
      .catch((e) => setMetaError(e.message))
  }, [])

  function addDay() {
    setItinerary((prev) => [...prev, initialDay()])
  }

  function updateDay(id, field, value) {
    setItinerary((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    )
  }

  function removeDay(id) {
    setItinerary((prev) => (prev.length > 1 ? prev.filter((d) => d.id !== id) : prev))
  }

  async function handlePublish() {
    setPublishError(null)
    setPublishBusy(true)
    try {
      const { id } = await apiPost('/api/tours', {
        creatorName: user?.name,
        title,
        destination,
        category,
        days,
        nights,
        dateFrom,
        dateTo,
        shortDesc,
        highlights,
        hotel,
        transport,
        guideAgency,
        contact,
        other,
        itinerary,
        galleryNote,
        price,
        maxTravelers,
        tourGuide,
      })
      navigate(`/tours/${id}`)
    } catch (e) {
      setPublishError(e.message || 'Could not publish')
    } finally {
      setPublishBusy(false)
    }
  }

  const maxStep = 6

  return (
    <div className="stack tour-wizard">
      {metaError ? (
        <p className="load-error compact">
          Could not load form options: {metaError}
        </p>
      ) : null}
      <div className="wizard-steps">
        {['Basics', 'Details', 'Itinerary', 'Images', 'Price', 'Preview'].map(
          (label, i) => (
            <span
              key={label}
              className={`wizard-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}
            >
              {i + 1}. {label}
            </span>
          ),
        )}
      </div>

      {step === 1 && (
        <div className="card wizard-panel">
          <h2 className="section-title">Tour basics</h2>
          <label className="field">
            <span>Tour title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tour title"
            />
          </label>
          <label className="field">
            <span>Destination</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={!destinations.length}
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!categories.length}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="field-row">
            <label className="field">
              <span>Days</span>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Nights</span>
              <input
                type="number"
                min={0}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label className="field">
              <span>To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>
          <label className="field">
            <span>Short description</span>
            <textarea
              rows={3}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Short description"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="card wizard-panel">
          <h2 className="section-title">Tour details</h2>
          <label className="field">
            <span>Highlights</span>
            <textarea
              rows={2}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Hotel</span>
            <input value={hotel} onChange={(e) => setHotel(e.target.value)} />
          </label>
          <label className="field">
            <span>Transportation</span>
            <input
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Guide / agency</span>
            <input
              value={guideAgency}
              onChange={(e) => setGuideAgency(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Contact number</span>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Other</span>
            <textarea
              rows={2}
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="card wizard-panel">
          <h2 className="section-title">Tour planning</h2>
          <p className="hint">
            Add days with date, title, and description. Reorder using the
            Up/Down controls.
          </p>
          <button type="button" className="btn secondary" onClick={addDay}>
            Add day
          </button>
          <ul className="itinerary-list">
            {itinerary.map((d, index) => (
              <li key={d.id} className="itinerary-item card inner">
                <div className="itinerary-item-head">
                  <span>Day {index + 1}</span>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn ghost small"
                      disabled={index === 0}
                      onClick={() => {
                        const next = [...itinerary]
                        ;[next[index - 1], next[index]] = [
                          next[index],
                          next[index - 1],
                        ]
                        setItinerary(next)
                      }}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="btn ghost small"
                      disabled={index === itinerary.length - 1}
                      onClick={() => {
                        const next = [...itinerary]
                        ;[next[index + 1], next[index]] = [
                          next[index],
                          next[index + 1],
                        ]
                        setItinerary(next)
                      }}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="btn ghost small danger"
                      onClick={() => removeDay(d.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <label className="field">
                  <span>Date</span>
                  <input
                    type="date"
                    value={d.date}
                    onChange={(e) => updateDay(d.id, 'date', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Title</span>
                  <input
                    value={d.title}
                    onChange={(e) => updateDay(d.id, 'title', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Description</span>
                  <textarea
                    rows={2}
                    value={d.description}
                    onChange={(e) =>
                      updateDay(d.id, 'description', e.target.value)
                    }
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 4 && (
        <div className="card wizard-panel">
          <h2 className="section-title">Images</h2>
          <p className="hint">
            Cover image is required. Additional images will appear in this
            section.
          </p>
          <div className="image-upload-zone">
            <span>Cover image (required)</span>
            <button type="button" className="btn secondary">
              Choose file
            </button>
          </div>
          <label className="field">
            <span>Gallery note</span>
            <input
              value={galleryNote}
              onChange={(e) => setGalleryNote(e.target.value)}
              placeholder="Optional caption for extra photos"
            />
          </label>
          <button type="button" className="btn secondary">
            Add image
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="card wizard-panel">
          <h2 className="section-title">Price &amp; capacity</h2>
          <label className="field">
            <span>Price per person</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="field">
            <span>Max travelers</span>
            <input
              type="number"
              min={1}
              value={maxTravelers}
              onChange={(e) => setMaxTravelers(e.target.value)}
              placeholder="20"
            />
          </label>
          <label className="field">
            <span>Tour guide</span>
            <select
              value={tourGuide}
              onChange={(e) => setTourGuide(e.target.value)}
              disabled={!guideNames.length}
            >
              {guideNames.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 6 && (
        <div className="card wizard-panel preview-panel">
          <h2 className="section-title">Preview before publish</h2>
          <p className="hint">
            Preview the poster/QR and publish to make the tour visible on the
            public tour page.
          </p>
          {publishError ? (
            <p className="load-error compact">{publishError}</p>
          ) : null}
          <div className="preview-card">
            <div className="preview-cover">Cover preview</div>
            <h3>{title || 'Tour title'}</h3>
            <p className="muted">{shortDesc || 'Short description'}</p>
            <p>
              <strong>Duration:</strong> {days}D / {nights}N ·{' '}
              <strong>Dates:</strong>{' '}
              {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : 'From — To'}
            </p>
            <p>
              <strong>Highlight:</strong> {highlights || 'Highlight'}
            </p>
            <p>
              <strong>Price:</strong>{' '}
              {price ? `฿${price}` : 'Price'} · <strong>Max:</strong>{' '}
              {maxTravelers || 'Max'} travelers
            </p>
            <p>
              <strong>Contact:</strong> {contact || 'Contact number'}
            </p>
            <div className="preview-thumbs">
              <span className="thumb">Image 1</span>
              <span className="thumb">Image 2</span>
              <span className="thumb">Image 3</span>
            </div>
            <div className="qr-placeholder">QR</div>
          </div>
        </div>
      )}

      <div className="wizard-actions">
        {step > 1 && (
          <button
            type="button"
            className="btn secondary"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className="btn ghost"
          onClick={() => navigate('/tours')}
        >
          Cancel
        </button>
        {step < maxStep && (
          <button
            type="button"
            className="btn primary"
            onClick={() => setStep((s) => Math.min(maxStep, s + 1))}
          >
            Next
          </button>
        )}
        {step === maxStep && (
          <>
            <button type="button" className="btn secondary">
              Save draft
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={handlePublish}
              disabled={publishBusy}
            >
              {publishBusy ? 'Publishing…' : 'Publish'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
