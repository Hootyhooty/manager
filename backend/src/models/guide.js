import mongoose from 'mongoose'

const { Schema } = mongoose

export const GuideSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    toursCost: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    status: { type: String, default: 'Active' },
    remark: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Guide = mongoose.models.Guide || mongoose.model('Guide', GuideSchema, 'guides')

