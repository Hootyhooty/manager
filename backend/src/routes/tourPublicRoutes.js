import { Router } from 'express'

import { getTourById } from '../controllers/tourPublicController.js'

const router = Router()

router.get('/tours/:tourId', getTourById)

export default router

