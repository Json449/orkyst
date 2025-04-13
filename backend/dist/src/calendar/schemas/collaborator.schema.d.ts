import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const CollaboratorSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
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
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    calendarId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    calendarId: mongoose.Types.ObjectId;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    calendarId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface CollaboratorDocument extends Document {
    userId: mongoose.Types.ObjectId;
    email: string;
    name: string;
    role: 'viewer' | 'editor' | 'admin';
    calendarId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Collaborator: mongoose.Model<CollaboratorDocument, {}, {}, {}, mongoose.Document<unknown, {}, CollaboratorDocument> & CollaboratorDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
