import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const FeedbackSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    text: string;
    comment: string;
    eventId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    text: string;
    comment: string;
    eventId: mongoose.Types.ObjectId;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    text: string;
    comment: string;
    eventId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface FeedbackDocument extends Document {
    userId: string;
    comment: string;
    eventId: string;
    text: string;
}
export declare const Feedback: mongoose.Model<FeedbackDocument, {}, {}, {}, mongoose.Document<unknown, {}, FeedbackDocument> & FeedbackDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
