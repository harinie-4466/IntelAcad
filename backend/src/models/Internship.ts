import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  hrName: string;
  hrEmail: string;
  hrMobile: string;
  companyWebsite: string;
  companyLocation: string;
  city: string;
  internshipTitle: string;
  duration: number;
  durationUnit: 'Days' | 'Weeks' | 'Months';
  positions: number;
  deadline: Date;
  deadlineType: 'Hybrid' | 'Remote' | 'In-office';
  stipendType: 'Paid' | 'Unpaid' | 'Performance-based';
  eligibility: string;
  perks: string;
  skills: string[];
  selectionSteps: string[];
  status: 'active' | 'closed' | 'draft';
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    hrName: {
      type: String,
      required: [true, 'HR name is required'],
      trim: true,
    },
    hrEmail: {
      type: String,
      required: [true, 'HR email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    hrMobile: {
      type: String,
      required: [true, 'HR mobile is required'],
      trim: true,
    },
    companyWebsite: {
      type: String,
      required: [true, 'Company website is required'],
      trim: true,
    },
    companyLocation: {
      type: String,
      required: [true, 'Company location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    internshipTitle: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
      minlength: [10, 'Internship title must be at least 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1'],
    },
    durationUnit: {
      type: String,
      enum: ['Days', 'Weeks', 'Months'],
      default: 'Weeks',
    },
    positions: {
      type: Number,
      required: [true, 'Number of positions is required'],
      min: [1, 'Number of positions must be at least 1'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      validate: {
        validator: function(value: Date) {
          return value > new Date();
        },
        message: 'Deadline must be a future date',
      },
    },
    deadlineType: {
      type: String,
      enum: ['Hybrid', 'Remote', 'In-office'],
      default: 'Hybrid',
    },
    stipendType: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Performance-based'],
      default: 'Paid',
    },
    eligibility: {
      type: String,
      trim: true,
    },
    perks: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function(value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    selectionSteps: {
      type: [String],
      required: [true, 'At least one selection step is required'],
      validate: {
        validator: function(value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one selection step is required',
      },
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching internships
internshipSchema.index({ internshipTitle: 'text', companyName: 'text' });
internshipSchema.index({ deadline: 1, status: 1 });

const Internship = mongoose.model<IInternship>('Internship', internshipSchema);

export default Internship;
