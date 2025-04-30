"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const calendar_controller_1 = require("./calendar.controller");
const calendar_service_1 = require("./calendar.service");
const calendar_schema_1 = require("./schemas/calendar.schema");
const event_schema_1 = require("./schemas/event.schema");
const versionhistory_schema_1 = require("./schemas/versionhistory.schema");
const collaborator_schema_1 = require("./schemas/collaborator.schema");
const feedback_schema_1 = require("./schemas/feedback.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const job_schema_1 = require("./schemas/job.schema");
let CalendarModule = class CalendarModule {
};
exports.CalendarModule = CalendarModule;
exports.CalendarModule = CalendarModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Calendar', schema: calendar_schema_1.CalendarSchema },
                { name: 'Collaborator', schema: collaborator_schema_1.CollaboratorSchema },
                { name: 'Job', schema: job_schema_1.JobSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Event', schema: event_schema_1.EventSchema },
                { name: 'VersionHistory', schema: versionhistory_schema_1.VersionHistorySchema },
                { name: 'Collaborator', schema: collaborator_schema_1.CollaboratorSchema },
                { name: 'Feedback', schema: feedback_schema_1.FeedbackSchema },
            ]),
        ],
        controllers: [calendar_controller_1.CalendarController],
        providers: [calendar_service_1.CalendarService],
        exports: [calendar_service_1.CalendarService],
    })
], CalendarModule);
//# sourceMappingURL=calendar.module.js.map