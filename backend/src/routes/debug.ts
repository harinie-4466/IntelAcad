import express from 'express'
import { getMe } from '../controllers/debugController'
import { protect } from '../middleware/auth'

const router = express.Router()

// Dev-only route - supports ?token=... for quick checks
router.get('/me', getMe)
export default router
