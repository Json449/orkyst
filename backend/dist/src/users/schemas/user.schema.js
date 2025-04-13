"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const roles_enum_1 = require("../../auth/roles.enum");
exports.UserSchema = new mongoose_1.Schema({
    userId: { type: String, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(roles_enum_1.Role),
        default: roles_enum_1.Role.OWNER,
        required: true,
    },
    isVerified: { type: Boolean, required: true },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    company: { type: String, default: '' },
}, { timestamps: true });
//# sourceMappingURL=user.schema.js.map