import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { FeedbackDocument } from './feedback.schema'; // Import the Feedback document type

export const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    audienceFocus: { type: String, required: true },
    type: { type: String, required: true },
    theme: { type: String, required: true },
    description: { type: String },
    artwork: { type: String },
    feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
    calendarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calendar',
      required: true,
    },
    version: { type: Number, default: 1 }, // Current version of the event
    versionHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'VersionHistory' }, // Array of version IDs
    ],
  },
  { timestamps: true },
);

// Interface for the Event document
export interface EventDocument extends Document {
  title: string;
  date: Date;
  audienceFocus: string;
  type: string;
  theme: string;
  description: string;
  artwork: string;
  feedback: FeedbackDocument[]; // Or ObjectId[] if you store references
  calendarId: string; // Or ObjectId if referencing a Calendar model
  version: number; // Current version of the event
  versionHistory: mongoose.Types.ObjectId[]; // Array of version IDs
}
