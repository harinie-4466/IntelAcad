import { Schema, model } from 'mongoose'

// Company Profile Interface
export interface ICompanyProfile {
  companyName?: string
  industry?: string
  companySize?: string
  website?: string
  description?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  contactPerson?: string
  designation?: string
  phone?: string
  alternateEmail?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  foundedYear?: string
  logo?: string
  registrationNumber?: string
  gstNumber?: string
  panNumber?: string
  profileCompleted?: boolean
}

// Company User Interface
export interface ICompany {
  companyName: string
  email: string
  password: string
  role: 'company'
  verified: boolean
  profile?: ICompanyProfile
  tokens?: {
    token: string
    createdAt: Date
    expiresAt: Date
  }[]
  createdAt?: Date
  updatedAt?: Date
}

// Company Profile Schema
const companyProfileSchema = new Schema<ICompanyProfile>({
  companyName: { type: String },
  industry: { type: String },
  companySize: { type: String }, // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
  website: { type: String },
  description: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  contactPerson: { type: String },
  designation: { type: String },
  phone: { type: String },
  alternateEmail: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  facebook: { type: String },
  foundedYear: { type: String },
  logo: { type: String },
  registrationNumber: { type: String },
  gstNumber: { type: String },
  panNumber: { type: String },
  profileCompleted: { type: Boolean, default: false }
}, { _id: false })

// Company Schema
const companySchema = new Schema<ICompany>({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    default: 'company',
    immutable: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  profile: {
    type: companyProfileSchema,
    default: () => ({})
  },
  tokens: [{
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  }]
}, {
  timestamps: true
})

// Index for faster queries
companySchema.index({ email: 1 })
companySchema.index({ companyName: 1 })

const Company = model<ICompany>('Company', companySchema)

export default Company
