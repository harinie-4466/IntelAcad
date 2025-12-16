import { Schema, model } from 'mongoose'

// Company Contact Form Interface
export interface ICompanyContact {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  industry?: string
  companySize?: string
  message: string
  type: 'inquiry' | 'partnership' | 'recruitment' | 'support' | 'other'
  status: 'pending' | 'contacted' | 'in-discussion' | 'closed'
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

// Company Contact Schema
const companyContactSchema = new Schema<ICompanyContact>({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: ['inquiry', 'partnership', 'recruitment', 'support', 'other'],
    default: 'inquiry'
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'in-discussion', 'closed'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes for faster queries
companyContactSchema.index({ email: 1 })
companyContactSchema.index({ status: 1 })
companyContactSchema.index({ type: 1 })
companyContactSchema.index({ createdAt: -1 })

const CompanyContact = model<ICompanyContact>('CompanyContact', companyContactSchema)

export default CompanyContact
