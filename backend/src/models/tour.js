import mongoose from 'mongoose'

import { TourItineraryItemSchema } from './tourItineraryItem.js'

const { Schema } = mongoose

export const TourSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', index: true },
    title: { type: String, required: true },

    destination: { type: String, default: '' },
    category: { type: String, default: '' },
    days: { type: Number, default: 0 },
    nights: { type: Number, default: 0 },
    dateFrom: { type: String, default: '' },
    dateTo: { type: String, default: '' },

    shortDesc: { type: String, default: '' },
    highlights: { type: String, default: '' },
    hotel: { type: String, default: '' },
    transport: { type: String, default: '' },
    guideAgency: { type: String, default: '' },
    contact: { type: String, default: '' },
    other: { type: String, default: '' },

    itinerary: { type: [TourItineraryItemSchema], default: [] },
    galleryNote: { type: String, default: '' },

    pricePerPerson: { type: Number, default: null },
    maxTravelers: { type: Number, default: null },
    tourGuide: { type: String, default: '' },

    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema, 'tours')

