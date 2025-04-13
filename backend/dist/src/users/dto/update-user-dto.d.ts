declare class CalendarInputsDto {
    category: string;
    audience: string;
    theme: string;
    contentTypes: string;
    posting: string;
}
export declare class UpdateUserDto {
    userId?: string;
    calendarInputs: CalendarInputsDto;
}
export {};
