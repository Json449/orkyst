import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CollaboratorDocument } from './collaborator.schema';

const CalendarInputsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: '',
    },
    audience: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
    contentTypes: {
      type: String,
      default: '',
    },
    posting: {
      type: String,
      default: '',
    },
  },
  { _id: false },
);

export const CalendarSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
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
  category?: string;
  audience?: string;
  theme?: string;
  contentTypes?: string;
  posting?: string;
}

export interface CalendarDocument extends Document {
  month: string;
  theme: string;
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
