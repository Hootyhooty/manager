import { Booking, Creator, Tour } from '../models/index.js'
import { mapTourToListRow } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listTours = asyncHandler(async (_req, res) => {
  const tours = await Tour.find({ status: 'Published' }).lean()

  if (!tours.length) return res.json([])

  const tourIds = tours.map((t) => t._id)
  const bookedAgg = await Booking.aggregate([
    { $match: { tourId: { $in: tourIds }, status: 'Confirmed' } },
    { $group: { _id: '$tourId', bookedTravelers: { $sum: '$travelers' } } },
  ])

  const bookedByTourId = new Map(bookedAgg.map((r) => [r._id.toString(), r.bookedTravelers]))

  const rows = tours
    .slice()
    .sort((a, b) => String(b.dateFrom).localeCompare(String(a.dateFrom)))
    .map((t) => mapTourToListRow(t, bookedByTourId.get(t._id.toString())))

  res.json(rows)
})

export const publishTour = asyncHandler(async (req, res) => {
  const body = req.body ?? {}

  const creatorName = String(body.creatorName ?? '').trim()
  const creator = creatorName
    ? await Creator.findOne({ username: creatorName }).lean()
    : null

  let creatorId = creator?._id
  if (!creatorId && creatorName) {
    const newCreator = await Creator.create({ username: creatorName, name: creatorName })
    creatorId = newCreator._id
  }

  const pricePerPerson =
    body.price != null && body.price !== '' ? Number(body.price) : null
  const maxTravelers =
    body.maxTravelers != null && body.maxTravelers !== ''
      ? Number(body.maxTravelers)
      : null

  const tour = await Tour.create({
    creatorId: creatorId ?? null,
    title: String(body.title ?? '').trim() || 'Untitled tour',

    destination: String(body.destination ?? ''),
    category: String(body.category ?? ''),
    days: Number(body.days ?? 0),
    nights: Number(body.nights ?? 0),
    dateFrom: String(body.dateFrom ?? ''),
    dateTo: String(body.dateTo ?? ''),

    shortDesc: String(body.shortDesc ?? ''),
    highlights: String(body.highlights ?? ''),
    hotel: String(body.hotel ?? ''),
    transport: String(body.transport ?? ''),
    guideAgency: String(body.guideAgency ?? ''),
    contact: String(body.contact ?? ''),
    other: String(body.other ?? ''),
    itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
    galleryNote: String(body.galleryNote ?? ''),

    pricePerPerson,
    maxTravelers,
    tourGuide: String(body.tourGuide ?? ''),

    status: 'Published',
    publishedAt: new Date(),
  })

  res.status(201).json({ id: tour._id.toString() })
})

