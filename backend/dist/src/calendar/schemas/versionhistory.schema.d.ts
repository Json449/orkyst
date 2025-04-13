import { Schema, Document, Types } from 'mongoose';
export declare const VersionHistorySchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    version: number;
    updatedAt: NativeDate;
    eventId: Types.ObjectId;
    changes: any;
    updatedBy: Types.ObjectId;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    version: number;
    updatedAt: NativeDate;
    eventId: Types.ObjectId;
    changes: any;
    updatedBy: Types.ObjectId;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    version: number;
    updatedAt: NativeDate;
    eventId: Types.ObjectId;
    changes: any;
    updatedBy: Types.ObjectId;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export interface VersionHistory extends Document {
    eventId: Types.ObjectId;
    version: number;
    changes: any;
    updatedBy: Types.ObjectId;
    updatedAt: Date;
}
