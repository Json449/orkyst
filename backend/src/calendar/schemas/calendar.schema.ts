import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CollaboratorDocument } from './collaborator.schema';

const CalendarInputsSchema = new mongoose.Schema(
  {
    whoIsThisFor: {
      type: String,
      default: '',
    },
    businessType: {
      type: String,
      default: '',
    },
    targetAudience: {
      type: String,
      default: '',
    },
    marketingGoals: {
      type: [String],
      default: [],
    },
    domains: {
      type: [String],
      default: [],
    },
    postingFrequency: {
      type: [String],
      default: [],
    },
    preferredContentType: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

// Update your CalendarSchema to match your data structure
export const CalendarSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    contentStrategy: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    suggestions: {
      type: String,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collaborator',
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    calendarInputs: {
      type: CalendarInputsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export interface ICalendarInputs {
  whoIsThisFor?: string;
  businessType?: string;
  targetAudience?: string;
  marketingGoals?: string[];
  domains?: string[];
  postingFrequency?: string[];
  preferredContentType?: string[];
}

export interface CalendarDocument extends Document {
  month: string;
  contentStrategy: string;
  theme: string; // Changed from 'theme'
  events: mongoose.Types.ObjectId[];
  suggestions?: string;
  collaborators: CollaboratorDocument[] | mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  calendarInputs?: ICalendarInputs;
  createdAt: Date;
  updatedAt: Date;
}

// Virtual for populating collaborators
CalendarSchema.virtual('populatedCollaborators', {
  ref: 'Collaborator',
  localField: 'collaborators',
  foreignField: '_id',
  justOne: false,
});

export const Calendar = mongoose.model<CalendarDocument>(
  'Calendar',
  CalendarSchema,
);
