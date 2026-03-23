import { Router } from 'express'

import { listTours, publishTour } from '../controllers/tourController.js'

const router = Router()

router.get('/tours', listTours)
router.post('/tours', publishTour)

export default router

