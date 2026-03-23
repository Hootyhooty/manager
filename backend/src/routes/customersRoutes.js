import { Router } from 'express'

import { getCustomers } from '../controllers/customerController.js'

const router = Router()

router.get('/customers', getCustomers)

export default router

