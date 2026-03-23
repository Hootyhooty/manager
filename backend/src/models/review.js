import mongoose from 'mongoose'

const { Schema } = mongoose

export const ReviewSchema = new Schema(
  {
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: '' },
    author: { type: String, required: true, index: true },
  },
  { timestamps: true },
)

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'reviews')

