import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User'

// Dev-only: return the full user document (no password) so developers can inspect saved data.
export const getMe = asyncHandler(async (req: any, res: any) => {
  try {
    // If auth middleware already set req.user, use it
    if (req.user) {
      const user = await User.findById(req.user._id).select('-password')
      return res.json({ user })
    }

    // Otherwise allow token via query param for quick browser checks: ?token=...
    const token = (req.query && req.query.token) || req.headers['authorization']?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token provided' })

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ message: 'JWT_SECRET not configured' })

    const decoded: any = jwt.verify(token, secret)
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' })

    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ user })
  } catch (err) {
    console.error('[debugController] error:', err)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})
