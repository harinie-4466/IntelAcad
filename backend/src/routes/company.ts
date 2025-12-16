import express from 'express'
import {
  registerCompany,
  loginCompany,
  logoutCompany,
  logoutAllCompany,
  getCompanyProfile,
  updateCompanyProfile
} from '../controllers/companyAuthController'
import { protectCompany } from '../middleware/companyAuth'

const router = express.Router()

// Public routes
router.post('/register', registerCompany)
router.post('/login', loginCompany)

// Protected routes (require company authentication)
router.post('/logout', protectCompany, logoutCompany)
router.post('/logout-all', protectCompany, logoutAllCompany)
router.get('/profile', protectCompany, getCompanyProfile)
router.post('/profile', protectCompany, updateCompanyProfile)

export default router
