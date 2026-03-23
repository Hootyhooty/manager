import { Router } from 'express'

import { getGuides } from '../controllers/guideController.js'

const router = Router()

router.get('/guides', getGuides)

export default router

