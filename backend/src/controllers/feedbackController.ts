import asyncHandler from 'express-async-handler'
import Feedback from '../models/Feedback'

export const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, category, rating, message } = req.body
  const fb = await Feedback.create({ name, email, category, rating, message })
  res.status(201).json(fb)
})
