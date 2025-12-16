import express from 'express'
import {
  submitCompanyContact,
  getCompanyContacts,
  getCompanyContactById,
  updateCompanyContactStatus,
  deleteCompanyContact,
  getCompanyContactStats
} from '../controllers/companyContactController'
// Import admin auth middleware when available
// import { protectAdmin } from '../middleware/adminAuth'

const router = express.Router()

// Public routes
router.post('/', submitCompanyContact)

// Admin routes (uncomment when admin auth is implemented)
// router.get('/', protectAdmin, getCompanyContacts)
// router.get('/stats', protectAdmin, getCompanyContactStats)
// router.get('/:id', protectAdmin, getCompanyContactById)
// router.patch('/:id', protectAdmin, updateCompanyContactStatus)
// router.delete('/:id', protectAdmin, deleteCompanyContact)

// Temporary routes without auth (remove in production)
router.get('/', getCompanyContacts)
router.get('/stats', getCompanyContactStats)
router.get('/:id', getCompanyContactById)
router.patch('/:id', updateCompanyContactStatus)
router.delete('/:id', deleteCompanyContact)

export default router
