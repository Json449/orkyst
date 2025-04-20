declare class CalendarInputsDto {
    whoIsThisFor?: string;
    businessType?: string;
    targetAudience?: string;
    marketingGoals?: string[];
    domains?: string[];
    postingFrequency?: string[];
    preferredContentType?: string[];
}
export declare class UpdateUserDto {
    userId?: string;
    calendarInputs?: CalendarInputsDto;
}
export {};
