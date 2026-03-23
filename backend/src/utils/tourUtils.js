export function formatDateLabel(dateValue) {
  // dateValue comes from <input type="date" /> => YYYY-MM-DD
  const d = dateValue ? new Date(dateValue) : null
  if (!d || Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatMoneyThb(amount) {
  if (amount == null || amount === '' || Number.isNaN(Number(amount))) return '—'
  const n = Number(amount)
  return `฿${n.toLocaleString('en-US')}`
}

export function computeTourAvailability({ maxTravelers, bookedTravelers }) {
  if (maxTravelers == null || maxTravelers === '' || maxTravelers === 0) return 'Open'
  const cap = Number(maxTravelers)
  const booked = Number(bookedTravelers ?? 0)
  if (booked >= cap) return 'Full'
  if (booked / cap >= 0.75) return 'Almost Full'
  return 'Open'
}

export function mapTourToListRow(tour, bookedTravelers) {
  const travelers =
    tour.maxTravelers != null && tour.maxTravelers !== ''
      ? `${Number(bookedTravelers ?? 0)}/${tour.maxTravelers}`
      : '—'

  return {
    id: tour._id.toString(),
    tour: tour.title,
    date: formatDateLabel(tour.dateFrom),
    guide: tour.tourGuide || '—',
    price: tour.pricePerPerson != null ? formatMoneyThb(tour.pricePerPerson) : '—',
    cost: '—',
    travelers,
    status: computeTourAvailability({
      maxTravelers: tour.maxTravelers,
      bookedTravelers,
    }),
  }
}

