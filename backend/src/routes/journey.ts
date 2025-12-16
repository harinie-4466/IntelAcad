import express from 'express'
import { getJourney, upsertJourney } from '../controllers/journeyController'
import { protect } from '../middleware/auth'

const router = express.Router()

router.get('/', protect, getJourney)
router.post('/', protect, upsertJourney)

export default router
