import mongoose from 'mongoose'

export async function connectToMongo({ uri }) {
  if (!uri) throw new Error('Missing MongoDB connection string (MONGODB_URI).')

  // Keep the connection stable in dev mode (especially with nodemon/watch).
  if (mongoose.connection.readyState === 1) return mongoose.connection

  return mongoose.connect(uri)
}

