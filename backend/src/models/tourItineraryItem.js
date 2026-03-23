import mongoose from 'mongoose'

const { Schema } = mongoose

export const TourItineraryItemSchema = new Schema(
  {
    date: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false },
)

