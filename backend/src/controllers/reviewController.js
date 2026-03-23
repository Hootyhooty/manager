import mongoose from 'mongoose'

import { Review, Tour } from '../models/index.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getTourReviews = asyncHandler(async (req, res) => {
  const { tourId } = req.params
  if (!mongoose.isValidObjectId(tourId)) return res.json([])

  const tour = await Tour.findById(tourId).lean()
  if (!tour || tour.status !== 'Published') return res.json([])

  const reviews = await Review.find({ tourId }).sort({ createdAt: -1 }).lean()

  res.json(
    reviews.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      text: r.text,
      author: r.author,
      createdAt: r.createdAt,
    })),
  )
})

export const postTourReview = asyncHandler(async (req, res) => {
  const { tourId } = req.params
  if (!mongoose.isValidObjectId(tourId)) return res.status(404).json({ error: 'Not found' })

  const tour = await Tour.findById(tourId).lean()
  if (!tour || tour.status !== 'Published') return res.status(404).json({ error: 'Not found' })

  const rating = Number(req.body?.rating)
  const text = String(req.body?.text ?? '').trim()
  const author = String(req.body?.author ?? '').trim()

  if (!author) return res.status(400).json({ error: 'Author is required' })
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' })
  }

  const review = await Review.create({
    tourId: tour._id,
    rating,
    text,
    author,
  })

  res.status(201).json({
    id: review._id.toString(),
    rating: review.rating,
    text: review.text,
    author: review.author,
    createdAt: review.createdAt,
  })
})

