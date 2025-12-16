import { Schema, model } from 'mongoose'

export interface IProfile {
  rollNumber?: string
  branch?: string
  year?: string
  skills?: string[]
  bio?: string
  phone?: string
  contactNumber?: string
  linkedin?: string
  github?: string
  // frontend fields
  completedCourses?: string[]
  technicalSkills?: string[]
  careerInterests?: string[]
  careerBio?: string
  resumeFileName?: string
  certificationsFileNames?: string[]
  cgpa?: string
  location?: string
  avatar?: string
  profileCompleted?: boolean
}

export interface IUser {
  name: string
  email: string
  password: string
  profile?: IProfile
  tokens?: {
    token: string
    createdAt: Date
    expiresAt: Date
  }[]
}

const profileSchema = new Schema<IProfile>({
  rollNumber: { type: String },
  branch: { type: String },
  year: { type: String },
  skills: { type: [String], default: [] },
  bio: { type: String },
  phone: { type: String },
  contactNumber: { type: String },
  linkedin: { type: String },
  github: { type: String },
  // frontend fields
  completedCourses: { type: [String], default: [] },
  technicalSkills: { type: [String], default: [] },
  careerInterests: { type: [String], default: [] },
  careerBio: { type: String },
  resumeFileName: { type: String },
  certificationsFileNames: { type: [String], default: [] },
  cgpa: { type: String },
  location: { type: String },
  avatar: { type: String },
  profileCompleted: { type: Boolean, default: false },
})

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: profileSchema, default: {} },
  tokens: [{
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  }]
})

export default model<IUser>('User', userSchema)
