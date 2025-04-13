import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: { type: String, required: true },
    text: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  { timestamps: true },
);

// Interface for the Feedback document
export interface FeedbackDocument extends Document {
  userId: string; // Or ObjectId if referencing a User model
  comment: string;
  eventId: string; // Or ObjectId if referencing an Event model
  text: string;
}

export const Feedback = mongoose.model<FeedbackDocument>(
  'Feedback',
  FeedbackSchema,
);
