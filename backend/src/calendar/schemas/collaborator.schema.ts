import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const CollaboratorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['viewer', 'editor', 'admin'],
      default: 'editor',
    },
    calendarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calendar',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export interface CollaboratorDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  calendarId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Collaborator = mongoose.model<CollaboratorDocument>(
  'Collaborator',
  CollaboratorSchema,
);
