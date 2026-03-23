import { Booking, Customer, Tour } from '../models/index.js'
import { formatDateLabel } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getCustomers = asyncHandler(async (_req, res) => {
  const tours = await Tour.find({ status: 'Published' }).select('_id').lean()
  const tourIds = tours.map((t) => t._id)
  if (!tourIds.length) return res.json([])

  const bookings = await Booking.find({ tourId: { $in: tourIds } }).lean()
  if (!bookings.length) return res.json([])

  const uniqueCustomerNames = [...new Set(bookings.map((b) => b.customerName).filter(Boolean))]

  const customerDocs = await Customer.find({ name: { $in: uniqueCustomerNames } }).lean()
  const customerByName = new Map(customerDocs.map((c) => [c.name, c]))

  const tourById = new Map(
    (
      await Tour.find({ _id: { $in: tourIds } })
        .select('_id title dateFrom')
        .lean()
    ).map((t) => [t._id.toString(), t]),
  )

  // Group by customerName and pick the first tour they booked (wireframe-ish behavior).
  const grouped = new Map()
  for (const b of bookings) {
    const key = b.customerName || 'Unknown'
    if (grouped.has(key)) continue
    const t = tourById.get(b.tourId.toString())
    grouped.set(key, { booking: b, tour: t })
  }

  const rows = [...grouped.entries()].map(([customerName, { tour }]) => {
    const c = customerByName.get(customerName)
    return {
      customer: customerName,
      tourDate: tour ? `${tour.title} / ${formatDateLabel(tour.dateFrom)}` : '—',
      address: c?.address ?? '—',
      phone: c?.phone ?? '—',
      condition: c?.condition ?? '—',
      status: c?.status ?? 'Active',
    }
  })

  rows.sort((a, b) => a.customer.localeCompare(b.customer))
  res.json(rows)
})

