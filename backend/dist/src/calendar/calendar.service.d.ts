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
export declare class CalendarService {
    private readonly collaboratorModel;
    private readonly calendarModel;
    private readonly userModel;
    private readonly eventModel;
    private readonly feedbackModel;
    private readonly versionModel;
    private configService;
    private openai;
    constructor(collaboratorModel: Model<CollaboratorDocument>, calendarModel: Model<CalendarDocument>, userModel: Model<UserDocument>, eventModel: Model<EventDocument>, feedbackModel: Model<FeedbackDocument>, versionModel: Model<VersionHistory>, configService: ConfigService);
    getCalendarDetails(calendarId: string): Promise<CalendarDocument>;
    addCollaborator(calendarId: string, createCollaboratorDto: CreateCollaboratorDto): Promise<import("mongoose").Document<unknown, {}, CollaboratorDocument> & CollaboratorDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCalendarSuggestions(id: string): Promise<any>;
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
    revertEventVersion(payload: any): Promise<{
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
}
