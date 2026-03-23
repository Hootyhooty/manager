import mongoose from 'mongoose'

const { Schema } = mongoose

export const BookingSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', index: true },

    customerName: { type: String, default: '' },
    travelers: { type: Number, default: 0 },
    status: { type: String, default: 'Confirmed' },
  },
  { timestamps: true },
)

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema, 'bookings')

