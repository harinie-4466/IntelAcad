import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for type safety (optional but good practice)
export interface IResume extends Document {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  summary?: string;
  experiences?: any[];
  education?: any[];
  skills?: string[];
  projects?: any[];
  certifications?: any[];
  awards?: any[];
  hobbies?: string[];
  languages?: any[];
  template?: string;
  resumeName?: string;
  isDraft?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const ResumeSchema = new Schema<IResume>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    experiences: {
      type: [Object], // you can define nested sub-schema later if you want
      default: [],
    },
    education: {
      type: [Object],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [Object],
      default: [],
    },
    certifications: {
      type: [Object],
      default: [],
    },
    awards: {
      type: [Object],
      default: [],
    },
    hobbies: {
      type: [String],
      default: [],
    },
    languages: {
      type: [Object],
      default: [],
    },
    template: {
      type: String,
      trim: true,
      default: "classic",
    },
    resumeName: {
      type: String,
      trim: true,
      default: "Untitled Resume",
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation on hot reload (important in Next.js)
const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
