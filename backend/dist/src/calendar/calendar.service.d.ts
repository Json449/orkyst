import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CalendarDocument } from './schemas/calendar.schema';
import { EventDocument } from './schemas/event.schema';
import { FeedbackDocument } from './schemas/feedback.schema';
import { AddFeedbackDto } from './dto/add-feedback-dto';
import { VersionHistory } from './schemas/versionhistory.schema';
import { CollaboratorDocument } from './schemas/collaborator.schema';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JobDocument } from './schemas/job.schema';
import { CreateEventDto } from './dto/create-event-dto';
export declare class CalendarService {
    private readonly collaboratorModel;
    private readonly calendarModel;
    private readonly userModel;
    private readonly eventModel;
    private readonly feedbackModel;
    private readonly versionModel;
    private readonly jobModel;
    private configService;
    private openai;
    constructor(collaboratorModel: Model<CollaboratorDocument>, calendarModel: Model<CalendarDocument>, userModel: Model<UserDocument>, eventModel: Model<EventDocument>, feedbackModel: Model<FeedbackDocument>, versionModel: Model<VersionHistory>, jobModel: Model<JobDocument>, configService: ConfigService);
    getCalendarDetails(calendarId: string): Promise<CalendarDocument>;
    addCollaborator(calendarId: string, createCollaboratorDto: CreateCollaboratorDto): Promise<import("mongoose").Document<unknown, {}, CollaboratorDocument> & CollaboratorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCalendarSuggestions(id: string): Promise<any>;
    validateCalendarResponse(openAiResponse: string): Promise<any>;
    validateCalendarEvents(response: any, currentYear: any, currentMonth: any): Promise<any>;
    createEvents(events: any[], calendarId: string): Promise<any>;
    private processCalendar;
    private updateJob;
    generateCalendar(calendarInputs: any, userId: string): Promise<any>;
    getPrompt: (title: string, audienceFocus: any, theme: any, date: any, type: any) => string;
    generateBlogPostContent(id: string): Promise<(import("mongoose").Document<unknown, {}, EventDocument> & EventDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getEventDetails(id: string): Promise<import("mongoose").Document<unknown, {}, EventDocument> & EventDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCalendarList(id: string): Promise<(import("mongoose").Document<unknown, {}, CalendarDocument> & CalendarDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    addFeedback(payload: AddFeedbackDto): Promise<import("mongoose").Document<unknown, {}, FeedbackDocument> & FeedbackDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    generateImage: (body: {
        audience: string;
        theme: string;
        contentType: string;
        aiPrompt: any;
        cloudinaryUrl: any;
    }, eventId: any) => Promise<any>;
    addEvents(payload: CreateEventDto): Promise<{
        message: string;
        event?: any;
    }>;
    editEvent(payload: CreateEventDto, eventId: string): Promise<{
        message: string;
        event?: any;
    }>;
    deleteEvents(eventId: string, payload: {
        calendarId: string;
    }): Promise<{
        message: string;
        event?: any;
    }>;
    updateEvent(payload: any): Promise<{
        message: string;
        event?: any;
    }>;
    getEventSuggestion(eventId: string): Promise<{
        success: boolean;
        tips: any;
    } | undefined>;
    getJobStatus(jobId: string, userId: string): Promise<{
        status: "pending" | "processing" | "completed" | "failed";
        progress: number;
        result: any;
        error: string | undefined;
    }>;
}
