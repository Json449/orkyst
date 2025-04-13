"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collaborator = exports.CollaboratorSchema = void 0;
const mongoose = require("mongoose");
exports.CollaboratorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['viewer', 'editor', 'admin'],
        default: 'editor',
    },
    calendarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.Collaborator = mongoose.model('Collaborator', exports.CollaboratorSchema);
//# sourceMappingURL=collaborator.schema.js.map