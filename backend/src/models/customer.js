import mongoose from 'mongoose'

const { Schema } = mongoose

export const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    condition: { type: String, default: '' },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true },
)

export const Customer =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema, 'customers')

