"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionHistorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.VersionHistorySchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Event', required: true },
    version: { type: Number, required: true },
    changes: { type: mongoose_1.Schema.Types.Mixed, required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
//# sourceMappingURL=versionhistory.schema.js.map