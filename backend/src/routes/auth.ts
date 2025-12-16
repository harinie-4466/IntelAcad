import express from 'express'
import { register, login, logout, logoutAll } from '../controllers/authController'
import { protect } from '../middleware/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', protect, logout)
router.post('/logout-all', protect, logoutAll)

export default router
