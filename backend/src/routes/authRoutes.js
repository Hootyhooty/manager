import { Router } from 'express'

import { login, registerCreator } from '../controllers/authController.js'

const router = Router()

router.post('/auth/login', login)
router.post('/auth/register', registerCreator)

export default router

