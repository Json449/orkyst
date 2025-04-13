"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = exports.FeedbackSchema = void 0;
const mongoose = require("mongoose");
exports.FeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: { type: String, required: true },
    text: { type: String, required: true },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
}, { timestamps: true });
exports.Feedback = mongoose.model('Feedback', exports.FeedbackSchema);
//# sourceMappingURL=feedback.schema.js.map