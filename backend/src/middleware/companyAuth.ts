import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Company from '../models/Company'

export const protectCompany = asyncHandler(async (req: any, res, next) => {
  let token: string | undefined

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
      }

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

      // Check if user is a company
      if (decoded.role !== 'company') {
        res.status(403)
        throw new Error('Access denied. Company credentials required.')
      }

      // Get company from token
      const company = await Company.findById(decoded.id).select('-password')

      if (!company) {
        res.status(401)
        throw new Error('Company not found')
      }

      // Check if token exists in database (not revoked)
      const tokenExists = company.tokens?.some(t => t.token === token && t.expiresAt > new Date())
      
      if (!tokenExists) {
        res.status(401)
        throw new Error('Token has been revoked or expired')
      }

      req.company = company
      req.token = token
      next()
    } catch (error: any) {
      console.error('❌ Company auth error:', error.message)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})
