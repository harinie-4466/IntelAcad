import mongoose, { Schema, Document, Model } from "mongoose";

// Sub-schema for work experience entries
const WorkExperienceSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
});

// The main application interface
export interface IApplication extends Document {
  internshipId: string; // link to internship being applied for
  internshipTitle: string;
  companyName: string;
  userId: string; // student id if you track users

  // Personal details
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  dateOfBirth: Date;
  contactAddress: string;

  // Academic info
  university: string;
  course: string;
  specialization: string;
  yearOfGraduation: number;
  cgpa: number;
  languages: string[];
  skills: string[];

  // Professional info
  workExperience: Array<typeof WorkExperienceSchema>;
  linkedInUrl?: string;
  githubUrl?: string;

  // Uploaded files
  resumePath: string;
  certificationPaths: string[];

  // Metadata
  appliedDate?: Date;
  status: "Under Review" | "Shortlisted" | "Rejected" | "Hired";
}

// Main Mongoose schema
const ApplicationSchema = new Schema<IApplication>(
  {
    internshipId: { type: String, required: true },
    internshipTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    userId: { type: String, required: true },

    // Personal details
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    contactAddress: { type: String, required: true },

    // Academic info
    university: { type: String, required: true },
    course: { type: String, required: true },
    specialization: { type: String, required: true },
    yearOfGraduation: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    languages: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],

    // Professional info
    workExperience: [WorkExperienceSchema],
    linkedInUrl: { type: String },
    githubUrl: { type: String },

    // Files
    resumePath: { type: String, required: true },
    certificationPaths: [{ type: String }],

    // Metadata
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, default: "Under Review" },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Prevent model overwrite during dev hot reload
export const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
