import { Booking, Creator, Tour } from '../models/index.js'
import { formatDateLabel, formatMoneyThb, mapTourToListRow } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getDashboard = asyncHandler(async (_req, res) => {
  const publishedTours = await Tour.find({ status: 'Published' }).select(
    '_id title pricePerPerson maxTravelers dateFrom',
  ).lean()

  const tourIds = publishedTours.map((t) => t._id)

  const allConfirmedBookings = tourIds.length
    ? await Booking.find({ tourId: { $in: tourIds }, status: 'Confirmed' }).lean()
    : []

  const allPendingBookings = tourIds.length
    ? await Booking.find({ tourId: { $in: tourIds }, status: 'Pending' }).lean()
    : []

  const bookedTravelersByTourId = new Map()
  for (const b of allConfirmedBookings) {
    const k = b.tourId.toString()
    bookedTravelersByTourId.set(k, (bookedTravelersByTourId.get(k) ?? 0) + (b.travelers ?? 0))
  }

  const tourById = new Map(publishedTours.map((t) => [t._id.toString(), t]))

  const revenueConfirmed = allConfirmedBookings.reduce((sum, b) => {
    const t = tourById.get(b.tourId.toString())
    const price = t?.pricePerPerson ?? 0
    return sum + (b.travelers ?? 0) * price
  }, 0)

  const summaryStats = {
    totalTours: publishedTours.length,
    bookings: allConfirmedBookings.length + allPendingBookings.length,
    revenue: formatMoneyThb(revenueConfirmed),
    users: await Creator.countDocuments(),
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const revenuePendingThisMonth = allPendingBookings
    .filter((b) => b.createdAt >= startOfMonth && b.createdAt < endOfMonth)
    .reduce((sum, b) => {
      const t = tourById.get(b.tourId.toString())
      const price = t?.pricePerPerson ?? 0
      return sum + (b.travelers ?? 0) * price
    }, 0)

  const recentTours = publishedTours
    .slice()
    .sort((a, b) => String(b.dateFrom).localeCompare(String(a.dateFrom)))
    .slice(0, 2)
    .map((t) => mapTourToListRow(t, bookedTravelersByTourId.get(t._id.toString())))

  const recentBookings = [...allConfirmedBookings, ...allPendingBookings]
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 2)
    .map((b) => {
      const t = tourById.get(b.tourId.toString())
      return {
        customer: b.customerName || '—',
        tour: t?.title ?? '—',
        date: formatDateLabel(t?.dateFrom),
        travelers: b.travelers ?? 0,
        status: b.status ?? 'Confirmed',
      }
    })

  res.json({
    summaryStats,
    recentTours,
    recentBookings,
    revenueSummary: {
      thisMonth: formatMoneyThb(revenueConfirmed),
      pending: formatMoneyThb(revenuePendingThisMonth),
      refunds: formatMoneyThb(0),
    },
  })
})

