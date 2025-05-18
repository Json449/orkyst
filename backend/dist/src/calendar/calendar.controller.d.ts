import { CalendarService } from './calendar.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { CreateEventDto } from './dto/create-event-dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    getCalendarDetails(id: any): Promise<import("./schemas/calendar.schema").CalendarDocument>;
    addCollaborator(calendarId: string, createCollaboratorDto: CreateCollaboratorDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("./schemas/collaborator.schema").CollaboratorDocument> & import("./schemas/collaborator.schema").CollaboratorDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getCalendarList(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/calendar.schema").CalendarDocument> & import("./schemas/calendar.schema").CalendarDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    generateBlogPostContent(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/event.schema").EventDocument> & import("./schemas/event.schema").EventDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    addEvents(payload: CreateEventDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    editEvents(eventId: string, payload: CreateEventDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    deleteEvents(eventId: string, payload: {
        calendarId: string;
    }): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    getCalendarSuggestions(id: string): Promise<{
        result: any;
        status: number;
    }>;
    addFeedback(req: any, data: any): Promise<{
        result: import("mongoose").Document<unknown, {}, import("./schemas/feedback.schema").FeedbackDocument> & import("./schemas/feedback.schema").FeedbackDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        status: number;
    }>;
    generateImage(id: string, prompt: any): Promise<{
        result: any;
        status: number;
    }>;
    getEventSuggestion(id: string): Promise<{
        result: {
            success: boolean;
            tips: any;
        } | undefined;
        status: number;
    }>;
    updateEvent(req: any, payload: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    getJobStatus(req: any, jobId: string): Promise<{
        status: "pending" | "processing" | "completed" | "failed";
        progress: number;
        access_token: string;
        error: string | undefined;
    }>;
}
