import { Booking, Tour } from '../models/index.js'
import { formatDateLabel } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getBookings = asyncHandler(async (_req, res) => {
  const tours = await Tour.find({ status: 'Published' }).select('_id').lean()
  const tourIds = tours.map((t) => t._id)
  if (!tourIds.length) return res.json([])

  const bookings = await Booking.find({ tourId: { $in: tourIds } })
    .sort({ createdAt: -1 })
    .lean()
  if (!bookings.length) return res.json([])

  const tourById = new Map(
    (
      await Tour.find({ _id: { $in: tourIds } })
        .select('_id title dateFrom tourGuide pricePerPerson')
        .lean()
    ).map((t) => [t._id.toString(), t]),
  )

  res.json(
    bookings.map((b) => {
      const t = tourById.get(b.tourId.toString())
      return {
        customer: b.customerName || '—',
        tour: t?.title ?? '—',
        date: formatDateLabel(t?.dateFrom),
        travelers: b.travelers ?? 0,
        status: b.status ?? 'Confirmed',
      }
    }),
  )
})

