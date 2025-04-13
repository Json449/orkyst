import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CollaboratorDocument } from './collaborator.schema';
export declare const CalendarSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    theme: string;
    calendarInputs: {
        category: string;
        audience: string;
        theme: string;
        contentTypes: string;
        posting: string;
    };
    month: string;
    events: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    suggestions?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    theme: string;
    calendarInputs: {
        category: string;
        audience: string;
        theme: string;
        contentTypes: string;
        posting: string;
    };
    month: string;
    events: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    suggestions?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    theme: string;
    calendarInputs: {
        category: string;
        audience: string;
        theme: string;
        contentTypes: string;
        posting: string;
    };
    month: string;
    events: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    suggestions?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
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
export declare const Calendar: mongoose.Model<CalendarDocument, {}, {}, {}, mongoose.Document<unknown, {}, CalendarDocument> & CalendarDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
