import { Router } from 'express'

import { getBookings } from '../controllers/bookingController.js'

const router = Router()

router.get('/bookings', getBookings)

export default router

