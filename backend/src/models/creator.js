import mongoose from 'mongoose'

const { Schema } = mongoose

export const CreatorSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },

    // Display name for the dashboard/top bar
    name: { type: String, default: '' },

    // Registration fields (maker/publisher account)
    passwordHash: { type: String, default: '' },
    email: { type: String, default: '' },
    firstName: { type: String, default: '' },
    surname: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },

    // Optional address chosen via MapModal (reverse geocoding)
    address: {
      address_line1: { type: String, default: '' },
      address_line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      country: { type: String, default: '' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
  },
  { timestamps: true },
)

export const Creator =
  mongoose.models.Creator || mongoose.model('Creator', CreatorSchema, 'creators')

