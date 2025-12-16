import asyncHandler from 'express-async-handler'
import CompanyContact from '../models/CompanyContact'

// @desc    Submit company contact form
// @route   POST /api/company/contact
// @access  Public
export const submitCompanyContact = asyncHandler(async (req, res) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    website,
    industry,
    companySize,
    message,
    type
  } = req.body

  console.log('📧 Company Contact Form Submission:', { companyName, email, type })

  // Validate required fields
  if (!companyName || !contactPerson || !email || !phone || !message) {
    res.status(400)
    throw new Error('Please provide all required fields: companyName, contactPerson, email, phone, message')
  }

  // Create contact entry
  const contact = await CompanyContact.create({
    companyName,
    contactPerson,
    email: email.toLowerCase(),
    phone,
    website: website || '',
    industry: industry || '',
    companySize: companySize || '',
    message,
    type: type || 'inquiry',
    status: 'pending'
  })

  console.log('✅ Company contact form submitted successfully:', contact._id)

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you soon.',
    data: {
      id: contact._id,
      companyName: contact.companyName,
      contactPerson: contact.contactPerson,
      email: contact.email,
      phone: contact.phone,
      type: contact.type,
      status: contact.status,
      createdAt: contact.createdAt
    }
  })
})

// @desc    Get all company contacts (Admin only)
// @route   GET /api/company/contact
// @access  Private (Admin)
export const getCompanyContacts = asyncHandler(async (req, res) => {
  const { status, type, limit = 50, page = 1 } = req.query

  console.log('📋 Fetching company contacts:', { status, type, limit, page })

  // Build filter
  const filter: any = {}
  if (status) filter.status = status
  if (type) filter.type = type

  // Pagination
  const pageNum = parseInt(page as string) || 1
  const limitNum = parseInt(limit as string) || 50
  const skip = (pageNum - 1) * limitNum

  // Get contacts with pagination
  const contacts = await CompanyContact.find(filter)
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip(skip)
    .lean()

  // Get total count
  const total = await CompanyContact.countDocuments(filter)

  console.log(`✅ Retrieved ${contacts.length} company contacts (Total: ${total})`)

  res.json({
    success: true,
    data: contacts,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  })
})

// @desc    Get single company contact (Admin only)
// @route   GET /api/company/contact/:id
// @access  Private (Admin)
export const getCompanyContactById = asyncHandler(async (req, res) => {
  const { id } = req.params

  console.log('🔍 Fetching company contact by ID:', id)

  const contact = await CompanyContact.findById(id).lean()

  if (!contact) {
    res.status(404)
    throw new Error('Company contact not found')
  }

  console.log('✅ Company contact found:', contact._id)

  res.json({
    success: true,
    data: contact
  })
})

// @desc    Update company contact status (Admin only)
// @route   PATCH /api/company/contact/:id
// @access  Private (Admin)
export const updateCompanyContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status, notes } = req.body

  console.log('📝 Updating company contact status:', { id, status })

  // Validate status
  const validStatuses = ['pending', 'contacted', 'in-discussion', 'closed']
  if (status && !validStatuses.includes(status)) {
    res.status(400)
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
  }

  const contact = await CompanyContact.findById(id)

  if (!contact) {
    res.status(404)
    throw new Error('Company contact not found')
  }

  // Update fields
  if (status) contact.status = status
  if (notes !== undefined) contact.notes = notes

  await contact.save()

  console.log('✅ Company contact updated:', contact._id)

  res.json({
    success: true,
    message: 'Company contact updated successfully',
    data: contact
  })
})

// @desc    Delete company contact (Admin only)
// @route   DELETE /api/company/contact/:id
// @access  Private (Admin)
export const deleteCompanyContact = asyncHandler(async (req, res) => {
  const { id } = req.params

  console.log('🗑️ Deleting company contact:', id)

  const contact = await CompanyContact.findById(id)

  if (!contact) {
    res.status(404)
    throw new Error('Company contact not found')
  }

  await CompanyContact.deleteOne({ _id: id })

  console.log('✅ Company contact deleted:', id)

  res.json({
    success: true,
    message: 'Company contact deleted successfully'
  })
})

// @desc    Get company contact statistics (Admin only)
// @route   GET /api/company/contact/stats
// @access  Private (Admin)
export const getCompanyContactStats = asyncHandler(async (req, res) => {
  console.log('📊 Fetching company contact statistics')

  const stats = await CompanyContact.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ],
        total: [
          { $count: 'count' }
        ],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              companyName: 1,
              contactPerson: 1,
              email: 1,
              type: 1,
              status: 1,
              createdAt: 1
            }
          }
        ]
      }
    }
  ])

  const result = {
    byStatus: stats[0].byStatus,
    byType: stats[0].byType,
    total: stats[0].total[0]?.count || 0,
    recent: stats[0].recent
  }

  console.log('✅ Company contact statistics retrieved')

  res.json({
    success: true,
    stats: result
  })
})
