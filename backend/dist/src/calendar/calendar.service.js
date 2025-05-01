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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const jsonrepair_1 = require("jsonrepair");
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
let CalendarService = class CalendarService {
    constructor(collaboratorModel, calendarModel, userModel, eventModel, feedbackModel, versionModel, jobModel, configService) {
        this.collaboratorModel = collaboratorModel;
        this.calendarModel = calendarModel;
        this.userModel = userModel;
        this.eventModel = eventModel;
        this.feedbackModel = feedbackModel;
        this.versionModel = versionModel;
        this.jobModel = jobModel;
        this.configService = configService;
        this.getPrompt = (title, audienceFocus, theme, date, type) => {
            switch (type) {
                case 'Blog Post':
                    return (0, utils_1.generateDynamicBlogPostPrompt)(title, audienceFocus, theme, date);
                case 'Twiiter Post':
                    return (0, utils_1.twitterPrompt)(title, audienceFocus, theme, date);
                case 'LinkedIn Post':
                    return (0, utils_1.linkedInPrompt)(title, audienceFocus, theme, date);
                default:
                    return (0, utils_1.defaultPrompt)(title, audienceFocus, theme, date, type);
            }
        };
        this.generateImage = async (body, eventId) => {
            try {
                let prompt = '';
                if (body.cloudinaryUrl == null) {
                    if (body.aiPrompt != null) {
                        prompt = body.aiPrompt;
                    }
                    else {
                        prompt = (0, utils_1.imageGenerationPrompt)(body.theme, body.audience, body.contentType);
                    }
                    const response = await this.openai.images.generate({
                        model: 'dall-e-3',
                        prompt: prompt,
                        n: 1,
                        size: '1024x1024',
                        response_format: 'url',
                    });
                    await this.eventModel.findByIdAndUpdate(eventId, {
                        artwork: response.data[0].url,
                    });
                    return response.data[0].url;
                }
                else {
                    await this.eventModel.findByIdAndUpdate(eventId, {
                        artwork: body.cloudinaryUrl,
                    });
                    return body.cloudinaryUrl;
                }
            }
            catch (error) {
                console.error('Error generating image:', error);
                throw new Error('Failed to generate image');
            }
        };
        this.openai = new openai_1.OpenAI({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async getCalendarDetails(calendarId) {
        try {
            const data = await this.calendarModel
                .findById({ _id: calendarId })
                .populate({
                path: 'events',
                select: '-description',
            })
                .populate({
                path: 'collaborators',
                select: 'name',
            })
                .lean()
                .exec();
            if (data) {
                return data;
            }
            else {
                throw new Error('No record found');
            }
        }
        catch (error) {
            console.error('Error fetching calendar entries:', error);
            throw new Error('Error fetching calendar entries for the user');
        }
    }
    async addCollaborator(calendarId, createCollaboratorDto) {
        const calendar = await this.calendarModel.findById(calendarId);
        if (!calendar) {
            throw new Error('Calendar not found');
        }
        const user = await this.userModel.findOne({
            email: createCollaboratorDto.email,
        });
        if (!user) {
            throw new Error('User not found');
        }
        const existingCollaborator = await this.collaboratorModel.findOne({
            userId: user._id,
            calendarId,
        });
        if (existingCollaborator) {
            throw new Error('User is already a collaborator on this calendar');
        }
        const collaborator = new this.collaboratorModel({
            userId: user._id,
            email: createCollaboratorDto.email,
            name: user.fullname,
            role: createCollaboratorDto.role,
            calendarId,
        });
        const savedCollaborator = await collaborator.save();
        await this.calendarModel.findByIdAndUpdate(calendarId, { $addToSet: { collaborators: savedCollaborator._id } }, { new: true });
        return savedCollaborator;
    }
    async getCalendarSuggestions(id) {
        const calendar = await this.calendarModel.findById(id).exec();
        if (!calendar) {
            throw new Error('No record found');
        }
        if (calendar?.suggestions != null) {
            return JSON.parse(calendar.suggestions);
        }
        const prompt = (0, utils_1.calendarSuggestionPrompt)(calendar.calendarInputs);
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 1000,
                temperature: 1,
            });
            let data = (0, jsonrepair_1.jsonrepair)(response?.choices[0]?.message?.content);
            data = JSON.parse(data);
            let tips = data.tips;
            calendar.suggestions = JSON.stringify(tips);
            await calendar.save();
            return {
                success: true,
                tips,
            };
        }
        catch (error) {
            console.error('Error generating AI tips:', error);
            throw new Error('Failed to generate AI tips');
        }
    }
    async validateCalendarResponse(openAiResponse) {
        try {
            const fixedJson = (0, jsonrepair_1.jsonrepair)(openAiResponse);
            const parsedData = JSON.parse(fixedJson);
            if (!parsedData.month ||
                !parsedData.theme ||
                !Array.isArray(parsedData.events)) {
                throw new Error('Invalid calendar data structure from OpenAI');
            }
            const isValidEvents = parsedData.events.every((event) => {
                return event.title && event.date && event.type;
            });
            if (!isValidEvents) {
                throw new Error('Some calendar events are missing required fields');
            }
            return parsedData;
        }
        catch (error) {
            console.error('Validation failed:', error);
            throw new Error(`Calendar validation failed: ${error.message}`);
        }
    }
    async validateCalendarEvents(response, currentYear, currentMonth) {
        return response.events.map((event) => {
            const eventDate = new Date(event.date);
            if (eventDate.getFullYear() !== currentYear ||
                eventDate.getMonth() + 1 !== currentMonth) {
                event.date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
            }
            return event;
        });
    }
    async createEvents(events, calendarId) {
        try {
            const eventCreationPromises = events.map(async (eventData) => {
                try {
                    const newEvent = new this.eventModel({
                        title: eventData.title,
                        date: new Date(eventData.date),
                        type: eventData.type,
                        audienceFocus: eventData.audienceFocus,
                        theme: eventData.theme,
                        description: null,
                        calendarId: calendarId,
                    });
                    const savedEvent = await newEvent.save();
                    return savedEvent._id;
                }
                catch (eventError) {
                    console.error('Error saving event:', eventData, eventError);
                    throw new Error(`Failed to save event: ${eventData.title}`);
                }
            });
            return await Promise.all(eventCreationPromises);
        }
        catch (error) {
            console.error('Error in batch event creation:', error);
            throw new Error('Failed to create events');
        }
    }
    async processCalendar(jobId) {
        try {
            const job = await this.jobModel.findOne({ jobId });
            if (!job)
                throw new Error('Job not found');
            await this.updateJob(jobId, { status: 'processing', progress: 20 });
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const prompt = (0, utils_1.generateCalendarPrompt)(job.inputs, currentMonth, currentYear);
            await this.updateJob(jobId, { progress: 40 });
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 3000,
                temperature: 0.5,
            });
            await this.updateJob(jobId, { progress: 50 });
            const calendarData = await this.validateCalendarResponse(response?.choices[0]?.message?.content);
            await this.updateJob(jobId, { progress: 70 });
            const validatedEvents = await this.validateCalendarEvents(calendarData, currentYear, currentMonth);
            console.log('validated events', validatedEvents);
            calendarData.events = validatedEvents;
            calendarData.calendarInputs = job.inputs;
            calendarData.userId = job.userId;
            calendarData.suggestions = null;
            calendarData.isActive = true;
            const newCalendar = new this.calendarModel(calendarData);
            const eventIds = await this.createEvents(calendarData.events, newCalendar._id);
            newCalendar.events = eventIds;
            await this.updateJob(jobId, { progress: 90 });
            const check = await newCalendar.save();
            console.log('calendar', check);
            await this.updateJob(jobId, {
                status: 'completed',
                result: newCalendar,
                progress: 100,
            });
        }
        catch (error) {
            await this.updateJob(jobId, {
                status: 'failed',
                error: error.message,
            });
        }
    }
    async updateJob(jobId, updates) {
        await this.jobModel.updateOne({ jobId }, updates);
    }
    async generateCalendar(calendarInputs, userId) {
        try {
            const jobId = (0, uuid_1.v4)();
            await this.jobModel.create({
                jobId,
                userId,
                status: 'pending',
                inputs: calendarInputs,
                progress: 0,
            });
            this.processCalendar(jobId).catch(console.error);
            return { jobId };
        }
        catch (error) {
            console.error('Error generating calendar:', error);
            throw new Error('Failed to generate calendar');
        }
    }
    async generateBlogPostContent(id) {
        const event = await this.eventModel
            .findById(id)
            .populate({
            path: 'versionHistory',
            populate: {
                path: 'updatedBy',
                select: 'fullname',
            },
        })
            .populate({
            path: 'feedback',
            populate: {
                path: 'userId',
                select: 'fullname email',
            },
        })
            .exec();
        if (!event) {
            throw new Error('Event not found');
        }
        if (event.description != null) {
            return event;
        }
        const { theme, audienceFocus, title, date, type } = event;
        const prompt = this.getPrompt(title, audienceFocus, theme, date, type);
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 5000,
                temperature: 0.1,
            });
            let description = (0, jsonrepair_1.jsonrepair)(response?.choices[0]?.message?.content);
            description = JSON.parse(description);
            description = description.html;
            const updatedEvent = await this.eventModel
                .findByIdAndUpdate(id, { description }, { new: true })
                .exec();
            return updatedEvent;
        }
        catch (error) {
            console.error('Error generating calendar:', error);
            throw new Error('Failed to generate calendar');
        }
    }
    async getEventDetails(id) {
        try {
            const event = await this.eventModel.findById(id).exec();
            if (!event) {
                throw new Error('Event not found');
            }
            return event;
        }
        catch (e) {
            throw new Error('Event not found');
        }
    }
    async getCalendarList(id) {
        try {
            const userCollaborations = await this.collaboratorModel.find({
                userId: id,
            });
            const collaboratorIds = userCollaborations.map((c) => c._id);
            const calendars = await this.calendarModel
                .find({
                $or: [{ userId: id }, { collaborators: { $in: collaboratorIds } }],
            })
                .populate({
                path: 'collaborators',
                populate: { path: 'userId', model: 'User' },
            })
                .exec();
            return calendars;
        }
        catch (e) {
            throw new Error('Event not found');
        }
    }
    async addFeedback(payload) {
        try {
            const feedback = new this.feedbackModel(payload);
            const savedFeedback = await feedback.save();
            const event = await this.eventModel.findById(payload.eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            const feedbackArray = event.feedback;
            feedbackArray.push(savedFeedback._id);
            await event.save();
            return savedFeedback;
        }
        catch (error) {
            console.error('Error adding feedback:', error);
            throw new Error('Failed to add feedback');
        }
    }
    async revertEventVersion(payload) {
        const { eventId, version } = payload;
        try {
            const selectedVersion = await this.versionModel.findOne({
                eventId,
                version: Number(version),
            });
            if (!selectedVersion) {
                throw new Error('Version not found');
            }
            const event = await this.eventModel.findById(eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            event.set(selectedVersion.changes);
            await event.save();
            return { message: 'Event reverted successfully', event };
        }
        catch (error) {
            console.error('Error reverting event:', error);
            throw new Error('Failed to revert event');
        }
    }
    async updateEvent(payload) {
        const { eventId, updatedBy, changes, versionAction } = payload;
        try {
            const event = await this.eventModel.findById(eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            let newVersion = event.version;
            if (versionAction == 'new') {
                newVersion = event.version + 1;
            }
            const newVersionEntry = new this.versionModel({
                eventId: event._id,
                version: newVersion,
                changes: changes,
                updatedBy: updatedBy,
            });
            await newVersionEntry.save();
            event.versionHistory.push(newVersionEntry._id);
            if (event.versionHistory.length > 5) {
                const oldestVersionId = event.versionHistory.shift();
                await this.versionModel.findByIdAndDelete(oldestVersionId);
            }
            event.set(changes);
            event.version = newVersion;
            await event.save();
            return { message: 'Event updated successfully', event };
        }
        catch (error) {
            console.error('Error updating event:', error);
            throw new Error('Failed to update event');
        }
    }
    async getEventSuggestion(eventId) {
        const event = await this.eventModel.findById(eventId).exec();
        if (!event) {
            throw new Error('Event not found');
        }
        const prompt = (0, utils_1.eventSuggestionPrompt)(event);
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 1000,
                temperature: 1,
            });
            let data = (0, jsonrepair_1.jsonrepair)(response?.choices[0]?.message?.content);
            data = JSON.parse(data);
            let tips = data.tips;
            return {
                success: true,
                tips,
            };
        }
        catch (e) {
            console.log(e);
        }
    }
    async getJobStatus(jobId, userId) {
        try {
            const job = await this.jobModel.findOne({
                jobId,
                userId: userId,
            });
            if (!job)
                throw new Error('Job not found');
            return {
                status: job.status,
                progress: job.progress,
                result: job.result,
                error: job.error,
            };
        }
        catch (e) {
            throw new Error('Failed to  find job');
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Collaborator')),
    __param(1, (0, mongoose_2.InjectModel)('Calendar')),
    __param(2, (0, mongoose_2.InjectModel)('User')),
    __param(3, (0, mongoose_2.InjectModel)('Event')),
    __param(4, (0, mongoose_2.InjectModel)('Feedback')),
    __param(5, (0, mongoose_2.InjectModel)('VersionHistory')),
    __param(6, (0, mongoose_2.InjectModel)('Job')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        config_1.ConfigService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map