import asyncHandler from 'express-async-handler'
import Contact from '../models/Contact'

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
export const submitContact = asyncHandler(async (req: any, res: any) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  })

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you soon.',
    data: contact,
  })
})

// @route   GET /api/contact
// @desc    Get all contact submissions (Admin only)
// @access  Private/Admin
export const getContacts = asyncHandler(async (req: any, res: any) => {
  const { status, limit = 50, page = 1 } = req.query

  const query: any = {}
  if (status) query.status = status

  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))

  const total = await Contact.countDocuments(query)

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

// @route   PATCH /api/contact/:id
// @desc    Update contact status (Admin only)
// @access  Private/Admin
export const updateContactStatus = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params
  const { status } = req.body

  if (!['pending', 'reviewed', 'resolved'].includes(status)) {
    res.status(400)
    throw new Error('Invalid status value')
  }

  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )

  if (!contact) {
    res.status(404)
    throw new Error('Contact submission not found')
  }

  res.json({
    success: true,
    message: 'Contact status updated',
    data: contact,
  })
})
