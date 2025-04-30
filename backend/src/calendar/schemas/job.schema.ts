import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

// 1. Define TypeScript Interface
export interface JobDocument extends Document {
  jobId: string;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputs: any; // Consider replacing 'any' with a more specific interface
  result?: any;
  error?: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define Mongoose Schema
export const JobSchema = new mongoose.Schema<JobDocument>(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    inputs: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
    },
    error: {
      type: String,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to plain objects
  },
);

// 3. Add Indexes (optional but recommended)
JobSchema.index({ createdAt: 1 }); // For sorting/finding recent jobs
JobSchema.index({ status: 1 }); // For finding jobs by status

// 4. Create and Export Model
export const Job = mongoose.model<JobDocument>('Job', JobSchema);

// 5. Type for new Job creation (optional)
export type CreateJobInput = Omit<
  JobDocument,
  'createdAt' | 'updatedAt' | 'result' | 'error'
>;
