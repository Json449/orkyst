"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = exports.CalendarSchema = void 0;
const mongoose = require("mongoose");
const CalendarInputsSchema = new mongoose.Schema({
    whoIsThisFor: {
        type: String,
        default: '',
    },
    businessType: {
        type: String,
        default: '',
    },
    targetAudience: {
        type: String,
        default: '',
    },
    marketingGoals: {
        type: [String],
        default: [],
    },
    domains: {
        type: [String],
        default: [],
    },
    postingFrequency: {
        type: [String],
        default: [],
    },
    preferredContentType: {
        type: [String],
        default: [],
    },
}, { _id: false });
exports.CalendarSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    contentStrategy: {
        type: String,
        default: '',
    },
    theme: {
        type: String,
        default: '',
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    suggestions: {
        type: String,
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collaborator',
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    calendarInputs: {
        type: CalendarInputsSchema,
        default: () => ({}),
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.CalendarSchema.virtual('populatedCollaborators', {
    ref: 'Collaborator',
    localField: 'collaborators',
    foreignField: '_id',
    justOne: false,
});
exports.Calendar = mongoose.model('Calendar', exports.CalendarSchema);
//# sourceMappingURL=calendar.schema.js.map