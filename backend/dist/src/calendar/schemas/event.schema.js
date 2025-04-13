"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const mongoose = require("mongoose");
exports.EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    audienceFocus: { type: String, required: true },
    type: { type: String, required: true },
    theme: { type: String, required: true },
    description: { type: String },
    artwork: { type: String },
    feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
    calendarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
        required: true,
    },
    version: { type: Number, default: 1 },
    versionHistory: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'VersionHistory' },
    ],
}, { timestamps: true });
//# sourceMappingURL=event.schema.js.map