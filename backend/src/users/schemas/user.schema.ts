import { Schema, Document } from 'mongoose';
import { Role } from 'src/auth/roles.enum';

// Updated User schema with role field
export const UserSchema = new Schema(
  {
    userId: { type: String, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.OWNER,
      required: true,
    },
    isVerified: { type: Boolean, required: true },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    company: { type: String, default: '' },
  },
  { timestamps: true },
);

// Updated User interface
export interface UserDocument extends Document {
  userId?: string;
  email: string;
  password: string;
  fullname: string;
  role: Role; // Add this
  verificationCode: string;
  verificationCodeExpires: Date;
  company?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  access_token?: string;
}
