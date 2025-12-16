// models/InternshipFeedback.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInternshipFeedback extends Document {
  internshipRole: string;
  companyName: string;
  fullName: string;
  email: string;
  courseYear: string;
  duration: string;
  internshipType: string;
  challengesFaced: string;
  keyTakeaways: string;
  recommend: string;
  overallExperience: number;
  relevance: number;
  mentorSupport: number;
  skillsImproved: string[];
  submittedAt: Date;
}

const InternshipFeedbackSchema = new Schema<IInternshipFeedback>(
  {
    internshipRole: { type: String, required: true },
    companyName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    courseYear: { type: String, required: true },
    duration: { type: String, required: true },
    internshipType: { type: String, required: true },
    challengesFaced: { type: String, required: true },
    keyTakeaways: { type: String, required: true },
    recommend: { type: String, required: true },
    overallExperience: { type: Number, required: true },
    relevance: { type: Number, required: true },
    mentorSupport: { type: Number, required: true },
    skillsImproved: [{ type: String }],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InternshipFeedback: Model<IInternshipFeedback> =
  mongoose.models.InternshipFeedback ||
  mongoose.model<IInternshipFeedback>("InternshipFeedback", InternshipFeedbackSchema);

export default InternshipFeedback;
