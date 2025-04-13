import { Schema, Document, Types } from 'mongoose';

// Define the VersionHistory schema
export const VersionHistorySchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to the Event
    version: { type: Number, required: true }, // Version number
    changes: { type: Schema.Types.Mixed, required: true }, // Object containing the changes
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who made the changes
    updatedAt: { type: Date, default: Date.now }, // Timestamp of the update
  },
  { timestamps: true },
);

// Define the VersionHistory interface
export interface VersionHistory extends Document {
  eventId: Types.ObjectId; // Reference to the Event
  version: number; // Version number
  changes: any; // Use `any` for flexibility, or define a stricter type if needed
  updatedBy: Types.ObjectId; // User who made the changes
  updatedAt: Date; // Timestamp of the update
}
