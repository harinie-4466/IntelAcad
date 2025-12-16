import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertFeedback extends Document {
  certificationName: string;
  provider?: string;
  fullName: string;
  email: string;
  courseYear?: string;
  completionDate?: string;
  duration?: string;
  difficultyLevel?: string;
  keyLearnings?: string;
  suggestions?: string;
  contentQuality?: number;
  relevance?: number;
  support?: number;
  submittedAt?: string;
}

const CertificationFeedbackSchema = new Schema<ICertFeedback>(
  {
    certificationName: { type: String, required: true, index: true },
    provider: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    courseYear: { type: String },
    completionDate: { type: String },
    duration: { type: String },
    difficultyLevel: { type: String },
    keyLearnings: { type: String },
    suggestions: { type: String },
    contentQuality: { type: Number },
    relevance: { type: Number },
    support: { type: Number },
    submittedAt: { type: String },
  },
  { timestamps: true }
);

// Avoid model overwrite errors in dev/hot reload
const CertificationFeedback: Model<ICertFeedback> =
  (mongoose.models.CertificationFeedback as Model<ICertFeedback>) ||
  mongoose.model<ICertFeedback>("CertificationFeedback", CertificationFeedbackSchema);

export default CertificationFeedback;
