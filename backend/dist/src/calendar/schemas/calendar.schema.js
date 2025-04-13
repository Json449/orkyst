"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = exports.CalendarSchema = void 0;
const mongoose = require("mongoose");
const CalendarInputsSchema = new mongoose.Schema({
    category: {
        type: String,
        default: '',
    },
    audience: {
        type: String,
        default: '',
    },
    theme: {
        type: String,
        default: '',
    },
    contentTypes: {
        type: String,
        default: '',
    },
    posting: {
        type: String,
        default: '',
    },
}, { _id: false });
exports.CalendarSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
        required: true,
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