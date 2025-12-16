import asyncHandler from 'express-async-handler'
import User from '../models/User'

// @route   GET /api/profile
// @desc    Get user profile from MongoDB
// @access  Private
export const getProfile = asyncHandler(async (req: any, res: any) => {
  const user = req.user
  if (!user) {
    res.status(404)
    return res.json({ success: false, message: 'User not found' })
  }

  try {
    // Fetch fresh data from MongoDB to ensure we have the latest
    const dbUser = await User.findById(user._id).select('-password')
    
    if (!dbUser) {
      res.status(404)
      return res.json({ success: false, message: 'User not found in database' })
    }

    // Convert to plain object to remove Mongoose metadata
    const plainProfile = dbUser.profile ? JSON.parse(JSON.stringify(dbUser.profile)) : {}
    
    // Return profile merged with top-level name/email
    const profile = { 
      ...plainProfile, 
      name: dbUser.name, 
      email: dbUser.email,
      _id: dbUser._id
    }
    
    console.log('[profileController] Retrieved profile for user:', dbUser._id)
    
    res.json({ 
      success: true,
      profile 
    })
  } catch (err: any) {
    console.error('[profileController] Error fetching profile:', err)
    res.status(500)
    return res.json({ success: false, message: err.message || 'Failed to fetch profile' })
  }
})

// @route   POST /api/profile
// @desc    Update user profile in MongoDB
// @access  Private
export const updateProfile = asyncHandler(async (req: any, res: any) => {
  const user = req.user
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  console.log('[profileController] ===== UPDATE PROFILE REQUEST =====')
  console.log('[profileController] Request body:', JSON.stringify(req.body, null, 2))
  console.log('[profileController] User ID:', user._id)

  const {
    name,
    email,
    rollNumber,
    branch,
    year,
    skills,
    bio,
    phone,
    contactNumber,
    linkedin,
    github,
    completedCourses,
    technicalSkills,
    careerInterests,
    careerBio,
    resumeFileName,
    certificationsFileNames,
    cgpa,
    location,
    avatar,
    profileCompleted,
  } = req.body

  try {
    // Fetch current user from MongoDB
    const dbUser = await User.findById(user._id)
    
    if (!dbUser) {
      res.status(404)
      return res.json({ success: false, message: 'User not found in database' })
    }

    // Build partial profile from incoming fields
    const incomingProfile: any = {}
    
    if (rollNumber !== undefined) incomingProfile.rollNumber = rollNumber
    if (branch !== undefined) incomingProfile.branch = branch
    if (year !== undefined) incomingProfile.year = year
    if (bio !== undefined) incomingProfile.bio = bio
    if (phone !== undefined) incomingProfile.phone = phone
    if (contactNumber !== undefined) incomingProfile.contactNumber = contactNumber
    if (linkedin !== undefined) incomingProfile.linkedin = linkedin
    if (github !== undefined) incomingProfile.github = github
    if (resumeFileName !== undefined) incomingProfile.resumeFileName = resumeFileName
    if (cgpa !== undefined) incomingProfile.cgpa = cgpa
    if (location !== undefined) incomingProfile.location = location
    if (avatar !== undefined) incomingProfile.avatar = avatar
    if (careerBio !== undefined) incomingProfile.careerBio = careerBio
    if (profileCompleted !== undefined) incomingProfile.profileCompleted = !!profileCompleted
    
    // Handle array fields with validation
    if (certificationsFileNames !== undefined) {
      incomingProfile.certificationsFileNames = Array.isArray(certificationsFileNames) 
        ? certificationsFileNames 
        : []
    }
    if (completedCourses !== undefined) {
      incomingProfile.completedCourses = Array.isArray(completedCourses) 
        ? completedCourses 
        : []
    }
    if (technicalSkills !== undefined) {
      incomingProfile.technicalSkills = Array.isArray(technicalSkills) 
        ? technicalSkills 
        : []
    }
    if (careerInterests !== undefined) {
      incomingProfile.careerInterests = Array.isArray(careerInterests) 
        ? careerInterests 
        : []
    }

    // Normalize skills field (legacy support)
    if (skills !== undefined) {
      incomingProfile.skills = Array.isArray(skills) 
        ? skills 
        : typeof skills === 'string' && skills 
          ? skills.split(',').map((s: string) => s.trim()) 
          : []
    }

    // Merge with existing profile (convert to plain object first)
    const existingProfile = dbUser.profile ? JSON.parse(JSON.stringify(dbUser.profile)) : {}
    const mergedProfile = { ...existingProfile, ...incomingProfile }
    
    console.log('[profileController] Updating profile for user:', user._id)
    console.log('[profileController] Existing profile:', JSON.stringify(existingProfile))
    console.log('[profileController] Incoming profile:', JSON.stringify(incomingProfile))
    console.log('[profileController] Merged profile:', JSON.stringify(mergedProfile))

    // Update the profile directly on the document
    dbUser.profile = mergedProfile as any
    
    // Update top-level fields if provided
    if (name !== undefined) dbUser.name = name
    if (email !== undefined && email !== dbUser.email) {
      // Only check if email is being changed to a different value
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } })
      if (existingUser) {
        res.status(400)
        return res.json({ success: false, message: 'Email already in use by another account' })
      }
      dbUser.email = email
    } else if (email !== undefined && email === dbUser.email) {
      // Email is the same, no need to update but don't throw error
      console.log('[profileController] Email unchanged, skipping validation')
    }

    // Mark profile as modified (important for subdocuments!)
    dbUser.markModified('profile')
    
    // Save to MongoDB with validation
    console.log('[profileController] Saving user document...')
    await dbUser.save()
    
    // Fetch updated document
    const updated = await User.findById(user._id).select('-password')

    if (!updated) {
      res.status(500)
      throw new Error('Failed to update profile')
    }

    console.log('[profileController] Profile updated successfully')
    console.log('[profileController] Updated profile from DB:', JSON.stringify(updated.profile))

    // Convert to plain object to remove Mongoose metadata
    const plainProfile = updated.profile ? JSON.parse(JSON.stringify(updated.profile)) : {}
    
    // Return profile merged with name/email
    const respProfile = { 
      ...plainProfile, 
      name: updated.name, 
      email: updated.email,
      _id: updated._id
    }

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      profile: respProfile 
    })
  } catch (err: any) {
    console.error('[profileController] Failed to update profile:', err)
    
    // If status code is already set (from our validation), don't override it
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500)
    }
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      res.status(400)
      const validationMessage = Object.values(err.errors).map((e: any) => e.message).join(', ')
      return res.json({ success: false, message: validationMessage })
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      res.status(400)
      return res.json({ success: false, message: 'Email already exists' })
    }
    
    // Return the error message without throwing again
    return res.json({ success: false, message: err.message || 'Failed to update profile' })
  }
})

// @route   GET /api/profile/completeness
// @desc    Check profile completeness percentage
// @access  Private
export const getProfileCompleteness = asyncHandler(async (req: any, res: any) => {
  const user = req.user
  if (!user) {
    res.status(404)
    return res.json({ success: false, message: 'User not found' })
  }

  try {
    const dbUser = await User.findById(user._id).select('-password')
    
    if (!dbUser) {
      res.status(404)
      return res.json({ success: false, message: 'User not found in database' })
    }

    const profile: any = dbUser.profile || {}
    
    // Define required fields for a complete profile
    const requiredFields = [
      'rollNumber',
      'branch',
      'year',
      'bio',
      'phone',
      'linkedin',
      'github',
      'location',
      'cgpa',
    ]
    
    const arrayFields = [
      'technicalSkills',
      'careerInterests',
    ]
    
    let completedFields = 0
    const totalFields = requiredFields.length + arrayFields.length + 2 // +2 for name and email
    
    // Check top-level fields
    if (dbUser.name) completedFields++
    if (dbUser.email) completedFields++
    
    // Check required profile fields
    requiredFields.forEach(field => {
      if (profile[field] && profile[field].toString().trim()) {
        completedFields++
      }
    })
    
    // Check array fields (must have at least one item)
    arrayFields.forEach(field => {
      if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
        completedFields++
      }
    })
    
    const percentage = Math.round((completedFields / totalFields) * 100)
    const isComplete = percentage >= 80 // Consider 80% as complete
    
    res.json({
      success: true,
      completeness: {
        percentage,
        isComplete,
        completedFields,
        totalFields,
        missingFields: requiredFields.filter(field => !profile[field] || !profile[field].toString().trim())
      }
    })
  } catch (err: any) {
    console.error('[profileController] Error checking completeness:', err)
    res.status(500)
    return res.json({ success: false, message: err.message || 'Failed to check profile completeness' })
  }
})
