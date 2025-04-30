"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_collaborator_dto_1 = require("./dto/create-collaborator.dto");
let CalendarController = class CalendarController {
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    async getCalendarDetails(id) {
        return this.calendarService.getCalendarDetails(id);
    }
    async addCollaborator(calendarId, createCollaboratorDto) {
        try {
            const result = await this.calendarService.addCollaborator(calendarId, createCollaboratorDto);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            console.error('Error in addCollaborator:', error);
            throw new common_1.HttpException(error.response?.message ||
                error.message ||
                'Failed to add collaborator', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCalendarList(req) {
        return this.calendarService.getCalendarList(req.user.userId);
    }
    async generateBlogPostContent(id) {
        return this.calendarService.generateBlogPostContent(id);
    }
    async revertVersion(payload) {
        try {
            const result = await this.calendarService.revertEventVersion(payload);
            return {
                status: 'success',
                message: result.message,
                data: result.event,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to revert event version',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCalendarSuggestions(id) {
        let data = await this.calendarService.getCalendarSuggestions(id);
        return {
            result: data,
            status: 200,
        };
    }
    async addFeedback(req, data) {
        const response = await this.calendarService.addFeedback({
            userId: req.user.userId,
            ...data,
        });
        return {
            result: response,
            status: 200,
        };
    }
    async generateImage(id, prompt) {
        console.log('prompt', prompt);
        const response = await this.calendarService.generateImage(prompt, id);
        return {
            result: response,
            status: 200,
        };
    }
    async getEventSuggestion(id) {
        const response = await this.calendarService.getEventSuggestion(id);
        return {
            result: response,
            status: 200,
        };
    }
    async updateEvent(req, payload) {
        try {
            const result = await this.calendarService.updateEvent({
                updatedBy: req.user.userId,
                ...payload,
            });
            return {
                status: 'success',
                message: result.message,
                data: result.event,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to update event',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getJobStatus(req, jobId) {
        try {
            console.log('jobidd', jobId, req.user.userId);
            const job = await this.calendarService.getJobStatus(jobId, req.user.userId);
            return {
                status: job.status,
                progress: job.progress,
                result: job.result,
                error: job.error,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to find job',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Get)('details/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getCalendarDetails", null);
__decorate([
    (0, common_1.Post)('collaborator/:calendarId'),
    __param(0, (0, common_1.Param)('calendarId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_collaborator_dto_1.CreateCollaboratorDto]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "addCollaborator", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getCalendarList", null);
__decorate([
    (0, common_1.Get)('events/details/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "generateBlogPostContent", null);
__decorate([
    (0, common_1.Post)('event/revert-version'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "revertVersion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('suggestions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getCalendarSuggestions", null);
__decorate([
    (0, common_1.Post)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "addFeedback", null);
__decorate([
    (0, common_1.Put)('image-generation/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "generateImage", null);
__decorate([
    (0, common_1.Get)('event/suggestion/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getEventSuggestion", null);
__decorate([
    (0, common_1.Put)('event'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Get)('job-status/:jobId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getJobStatus", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map