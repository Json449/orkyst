import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { FeedbackDocument } from './feedback.schema';
export declare const EventSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    type: string;
    version: number;
    calendarId: mongoose.Types.ObjectId;
    title: string;
    audienceFocus: string;
    theme: string;
    feedback: mongoose.Types.ObjectId[];
    versionHistory: mongoose.Types.ObjectId[];
    description?: string | null | undefined;
    artwork?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    type: string;
    version: number;
    calendarId: mongoose.Types.ObjectId;
    title: string;
    audienceFocus: string;
    theme: string;
    feedback: mongoose.Types.ObjectId[];
    versionHistory: mongoose.Types.ObjectId[];
    description?: string | null | undefined;
    artwork?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: NativeDate;
    type: string;
    version: number;
    calendarId: mongoose.Types.ObjectId;
    title: string;
    audienceFocus: string;
    theme: string;
    feedback: mongoose.Types.ObjectId[];
    versionHistory: mongoose.Types.ObjectId[];
    description?: string | null | undefined;
    artwork?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface EventDocument extends Document {
    title: string;
    date: Date;
    audienceFocus: string;
    type: string;
    theme: string;
    description: string;
    artwork: string;
    feedback: FeedbackDocument[];
    calendarId: string;
    version: number;
    versionHistory: mongoose.Types.ObjectId[];
}
