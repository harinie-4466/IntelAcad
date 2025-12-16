import express from 'express'
import { submitContact, getContacts, updateContactStatus } from '../controllers/contactController'
import { protect } from '../middleware/auth'

const router = express.Router()

// Public route
router.post('/', submitContact)

// Protected routes (require authentication/admin)
// Uncomment when auth middleware is ready
// router.get('/', protect, getContacts)
// router.patch('/:id', protect, updateContactStatus)

export default router
