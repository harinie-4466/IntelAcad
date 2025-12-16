import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  
  // Add validation logging
  console.log('Registration attempt:', { name, email, hasPassword: !!password })
  
  // Validate required fields
  if (!name || !email || !password) {
    console.log('Validation failed - missing fields')
    return res.status(400).json({ 
      message: 'Please provide name, email, and password',
      received: { hasName: !!name, hasEmail: !!email, hasPassword: !!password }
    })
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.log('Validation failed - invalid email format')
    return res.status(400).json({ message: 'Please provide a valid email address' })
  }
  
  // Validate password length
  if (password.length < 6) {
    console.log('Validation failed - password too short')
    return res.status(400).json({ message: 'Password must be at least 6 characters long' })
  }
  
  const exists = await User.findOne({ email })
  if (exists) {
    console.log('Registration failed - user already exists')
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed })
  
  console.log('User created successfully:', user._id)
  
  // Generate JWT token for the new user
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  })
  
  // Store token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now
  
  user.tokens = user.tokens || []
  user.tokens.push({
    token,
    createdAt: new Date(),
    expiresAt
  })
  await user.save()
  
  res.status(201).json({ 
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  })

  // Store token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now
  
  user.tokens = user.tokens || []
  user.tokens.push({
    token,
    createdAt: new Date(),
    expiresAt
  })
  
  // Clean up expired tokens
  user.tokens = user.tokens.filter(t => new Date(t.expiresAt) > new Date())
  await user.save()

  res.json({ 
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  })
})

// @route   POST /api/auth/logout
// @desc    Logout user and remove token from database
// @access  Private
export const logout = asyncHandler(async (req: any, res) => {
  const user = req.user
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!user || !token) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  // Remove the specific token from user's tokens array
  const dbUser = await User.findById(user._id)
  if (dbUser && dbUser.tokens) {
    dbUser.tokens = dbUser.tokens.filter(t => t.token !== token)
    await dbUser.save()
  }

  res.json({ message: 'Logged out successfully' })
})

// @route   POST /api/auth/logout-all
// @desc    Logout user from all devices (remove all tokens)
// @access  Private
export const logoutAll = asyncHandler(async (req: any, res) => {
  const user = req.user
  
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  // Remove all tokens
  const dbUser = await User.findById(user._id)
  if (dbUser) {
    dbUser.tokens = []
    await dbUser.save()
  }

  res.json({ message: 'Logged out from all devices successfully' })
})
