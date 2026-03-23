import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectToMongo } from './utils/db.js'

import authRoutes from './routes/authRoutes.js'
import metaRoutes from './routes/metaRoutes.js'
import tourRoutes from './routes/tourRoutes.js'
import tourPublicRoutes from './routes/tourPublicRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import bookingsRoutes from './routes/bookingsRoutes.js'
import customersRoutes from './routes/customersRoutes.js'
import guidesRoutes from './routes/guidesRoutes.js'

dotenv.config()

const PORT = Number(process.env.PORT) || 3001

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))

// API routes (mounted under /api)
app.use('/api', authRoutes)
app.use('/api', metaRoutes)
app.use('/api', tourRoutes)
app.use('/api', tourPublicRoutes)
app.use('/api', reviewRoutes)
app.use('/api', dashboardRoutes)
app.use('/api', bookingsRoutes)
app.use('/api', customersRoutes)
app.use('/api', guidesRoutes)

// Not found
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error', details: err?.message })
})

async function start() {
  await connectToMongo({ uri: process.env.MONGODB_URI })
  app.listen(PORT, () => {
    console.log(`Tour manager API http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start Tour manager API:', err)
  process.exit(1)
})

