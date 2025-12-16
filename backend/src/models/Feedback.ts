import { Schema, model } from 'mongoose'

export interface IFeedback {
  name: string
  email: string
  category: string
  rating: string
  message: string
  createdAt?: Date
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

export default model<IFeedback>('Feedback', feedbackSchema)
