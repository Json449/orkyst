"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.JobSchema = void 0;
const mongoose = require("mongoose");
exports.JobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    inputs: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    result: {
        type: mongoose.Schema.Types.Mixed,
    },
    error: {
        type: String,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.JobSchema.index({ createdAt: 1 });
exports.JobSchema.index({ status: 1 });
exports.Job = mongoose.model('Job', exports.JobSchema);
//# sourceMappingURL=job.schema.js.map