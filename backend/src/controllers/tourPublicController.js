import mongoose from 'mongoose'

import { Review, Tour } from '../models/index.js'
import { formatDateLabel } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getTourById = asyncHandler(async (req, res) => {
  const { tourId } = req.params
  if (!mongoose.isValidObjectId(tourId)) return res.status(404).json({ error: 'Not found' })

  const tour = await Tour.findById(tourId).lean()
  if (!tour || tour.status !== 'Published') return res.status(404).json({ error: 'Not found' })

  const reviewAgg = await Review.aggregate([
    { $match: { tourId: tour._id } },
    { $group: { _id: '$tourId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  const reviewStats = reviewAgg[0] ?? { avgRating: null, count: 0 }

  res.json({
    id: tour._id.toString(),
    title: tour.title,
    destination: tour.destination,
    category: tour.category,
    days: tour.days,
    nights: tour.nights,
    dateFrom: tour.dateFrom,
    dateTo: tour.dateTo,
    dateLabel: formatDateLabel(tour.dateFrom),
    shortDesc: tour.shortDesc,
    highlights: tour.highlights,
    hotel: tour.hotel,
    transport: tour.transport,
    guideAgency: tour.guideAgency,
    contact: tour.contact,
    other: tour.other,
    itinerary: tour.itinerary,
    galleryNote: tour.galleryNote,
    pricePerPerson: tour.pricePerPerson,
    maxTravelers: tour.maxTravelers,
    tourGuide: tour.tourGuide,
    publishedAt: tour.publishedAt,

    reviewStats: {
      averageRating: reviewStats.avgRating,
      reviewCount: reviewStats.count,
    },
  })
})

