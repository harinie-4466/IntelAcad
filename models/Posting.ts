// models/Posting.ts
import mongoose, { Schema, model, models } from "mongoose";

const PostingSchema = new Schema(
  {
    companyName: { type: String, required: true },
    hrName: { type: String },
    hrEmail: { type: String },
    companyWebsite: { type: String },
    hrMobile: { type: String },
    companyLocation: { type: String },
    city: { type: String },
    internshipTitle: { type: String, required: true },
    description: { type: String },
    skills: { type: [String], default: [] },
    duration: { type: String },
    durationUnit: { type: String },
    positions: { type: String },
    deadline: { type: String },
    deadlineType: { type: String },
    selectionProcess: { type: [String], default: [] },
    stipendType: { type: String },
    stipendAmount: { type: String },
    eligibility: { type: String },
    perks: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // optionally: postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    collection: "posting",
    timestamps: true,
  }
);

const Posting = models.Posting || model("Posting", PostingSchema);
export default Posting;
