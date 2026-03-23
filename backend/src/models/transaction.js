import mongoose from 'mongoose'

const { Schema } = mongoose

export const TransactionSchema = new Schema(
  {
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },

    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'THB' },
    type: { type: String, enum: ['Payment', 'Refund'], default: 'Payment' },
    status: { type: String, enum: ['Pending', 'Confirmed'], default: 'Pending' },
  },
  { timestamps: true },
)

export const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema, 'transactions')

