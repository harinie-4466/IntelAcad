import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Company from '../models/Company'

// @desc    Register company
// @route   POST /api/company/register
// @access  Public
export const registerCompany = asyncHandler(async (req, res) => {
  const { companyName, email, password, contactPerson, phone, website, industry } = req.body

  console.log('📝 Company Registration Request:', { companyName, email, contactPerson })

  // Validate required fields
  if (!companyName || !email || !password) {
    res.status(400)
    throw new Error('Please provide company name, email, and password')
  }

  // Check if company already exists
  const companyExists = await Company.findOne({ email: email.toLowerCase() })
  if (companyExists) {
    console.log('❌ Company already exists:', email)
    res.status(400)
    throw new Error('Company with this email already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create company
  const company = await Company.create({
    companyName,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'company',
    verified: false,
    profile: {
      companyName,
      contactPerson: contactPerson || '',
      phone: phone || '',
      website: website || '',
      industry: industry || '',
      profileCompleted: false
    }
  })

  if (!company) {
    res.status(400)
    throw new Error('Invalid company data')
  }

  // Generate token
  const token = jwt.sign(
    { id: company._id, role: 'company' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  )

  // Store token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)
  
  company.tokens = company.tokens || []
  company.tokens.push({
    token,
    createdAt: new Date(),
    expiresAt
  })
  await company.save()

  console.log('✅ Company registered successfully:', company.email)

  res.status(201).json({
    token,
    company: {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      role: company.role,
      verified: company.verified
    }
  })
})

// @desc    Login company
// @route   POST /api/company/login
// @access  Public
export const loginCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  console.log('🔐 Company Login Request:', { email })

  // Validate required fields
  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  // Find company by email
  const company = await Company.findOne({ email: email.toLowerCase() })
  if (!company) {
    console.log('❌ Company not found:', email)
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // Check password
  const isPasswordMatch = await bcrypt.compare(password, company.password)
  if (!isPasswordMatch) {
    console.log('❌ Invalid password for company:', email)
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // Generate token
  const token = jwt.sign(
    { id: company._id, role: 'company' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  )

  // Store token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)
  
  company.tokens = company.tokens || []
  
  // Clean up expired tokens
  company.tokens = company.tokens.filter(t => t.expiresAt > new Date())
  
  // Add new token
  company.tokens.push({
    token,
    createdAt: new Date(),
    expiresAt
  })
  await company.save()

  console.log('✅ Company logged in successfully:', company.email)
  console.log(`📱 Active devices: ${company.tokens.length}`)

  res.json({
    token,
    company: {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      role: company.role,
      verified: company.verified
    }
  })
})

// @desc    Logout company (current device)
// @route   POST /api/company/logout
// @access  Private (Company)
export const logoutCompany = asyncHandler(async (req: any, res) => {
  const companyId = req.company?._id
  const token = req.token

  if (!companyId || !token) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const company = await Company.findById(companyId)
  if (!company) {
    res.status(404)
    throw new Error('Company not found')
  }

  // Remove current token
  company.tokens = company.tokens?.filter(t => t.token !== token) || []
  await company.save()

  console.log('✅ Company logged out from current device:', company.email)

  res.json({ message: 'Logged out successfully' })
})

// @desc    Logout company from all devices
// @route   POST /api/company/logout-all
// @access  Private (Company)
export const logoutAllCompany = asyncHandler(async (req: any, res) => {
  const companyId = req.company?._id

  if (!companyId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const company = await Company.findById(companyId)
  if (!company) {
    res.status(404)
    throw new Error('Company not found')
  }

  // Remove all tokens
  company.tokens = []
  await company.save()

  console.log('✅ Company logged out from all devices:', company.email)

  res.json({ message: 'Logged out from all devices successfully' })
})

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private (Company)
export const getCompanyProfile = asyncHandler(async (req: any, res) => {
  const companyId = req.company?._id

  if (!companyId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const company = await Company.findById(companyId).select('-password -tokens')
  
  if (!company) {
    res.status(404)
    throw new Error('Company not found')
  }

  res.json({
    success: true,
    profile: {
      id: company._id,
      companyName: company.companyName,
      email: company.email,
      role: company.role,
      verified: company.verified,
      ...company.profile
    }
  })
})

// @desc    Update company profile
// @route   POST /api/company/profile
// @access  Private (Company)
export const updateCompanyProfile = asyncHandler(async (req: any, res) => {
  const companyId = req.company?._id

  if (!companyId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const company = await Company.findById(companyId)
  
  if (!company) {
    res.status(404)
    throw new Error('Company not found')
  }

  // Update profile fields
  const profileFields = [
    'companyName', 'industry', 'companySize', 'website', 'description',
    'address', 'city', 'state', 'country', 'zipCode',
    'contactPerson', 'designation', 'phone', 'alternateEmail',
    'linkedin', 'twitter', 'facebook', 'foundedYear', 'logo',
    'registrationNumber', 'gstNumber', 'panNumber', 'profileCompleted'
  ]

  const currentProfile = company.profile || {}
  const updatedProfile: any = { ...currentProfile }

  profileFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updatedProfile[field] = req.body[field]
    }
  })

  company.profile = updatedProfile
  company.markModified('profile')
  await company.save()

  const savedCompany = await Company.findById(companyId).select('-password -tokens')

  console.log('✅ Company profile updated:', company.email)

  res.json({
    success: true,
    profile: {
      id: savedCompany?._id,
      companyName: savedCompany?.companyName,
      email: savedCompany?.email,
      role: savedCompany?.role,
      verified: savedCompany?.verified,
      ...savedCompany?.profile
    }
  })
})
