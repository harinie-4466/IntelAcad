import { Router } from 'express'
import { getProfile, updateProfile, getProfileCompleteness } from '../controllers/profileController'
import { protect } from '../middleware/auth'

const router = Router()

router.get('/', protect, getProfile)
router.post('/', protect, updateProfile)
router.get('/completeness', protect, getProfileCompleteness)

export default router
