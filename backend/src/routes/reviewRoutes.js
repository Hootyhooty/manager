import { Router } from 'express'

import { getTourReviews, postTourReview } from '../controllers/reviewController.js'

const router = Router()

router.get('/tours/:tourId/reviews', getTourReviews)
router.post('/tours/:tourId/reviews', postTourReview)

export default router

