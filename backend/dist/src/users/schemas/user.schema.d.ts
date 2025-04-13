import { Schema, Document } from 'mongoose';
import { Role } from 'src/auth/roles.enum';
export declare const UserSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    fullname: string;
    role: Role;
    isVerified: boolean;
    company: string;
    userId?: string | null | undefined;
    verificationCode?: string | null | undefined;
    verificationCodeExpires?: NativeDate | null | undefined;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    fullname: string;
    role: Role;
    isVerified: boolean;
    company: string;
    userId?: string | null | undefined;
    verificationCode?: string | null | undefined;
    verificationCodeExpires?: NativeDate | null | undefined;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    fullname: string;
    role: Role;
    isVerified: boolean;
    company: string;
    userId?: string | null | undefined;
    verificationCode?: string | null | undefined;
    verificationCodeExpires?: NativeDate | null | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface UserDocument extends Document {
    userId?: string;
    email: string;
    password: string;
    fullname: string;
    role: Role;
    verificationCode: string;
    verificationCodeExpires: Date;
    company?: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
