import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export interface JobDocument extends Document {
    jobId: string;
    userId: mongoose.Types.ObjectId;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    inputs: any;
    result?: any;
    error?: string;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const JobSchema: mongoose.Schema<JobDocument, mongoose.Model<JobDocument, any, any, any, mongoose.Document<unknown, any, JobDocument> & JobDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, JobDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<JobDocument>> & mongoose.FlatRecord<JobDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const Job: mongoose.Model<JobDocument, {}, {}, {}, mongoose.Document<unknown, {}, JobDocument> & JobDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export type CreateJobInput = Omit<JobDocument, 'createdAt' | 'updatedAt' | 'result' | 'error'>;
