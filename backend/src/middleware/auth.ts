import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User'

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'No token' })

  const token = auth.split(' ')[1]
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'Not authorized' })
    
    // Check if token exists in database and is not expired
    const tokenExists = user.tokens?.some(t => 
      t.token === token && new Date(t.expiresAt) > new Date()
    )
    
    if (!tokenExists) {
      return res.status(401).json({ message: 'Token has been revoked or expired' })
    }
    
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' })
  }
})
