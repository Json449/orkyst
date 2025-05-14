import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString() // ← Accepts ISO strings like "2023-11-20T14:30:00Z"
  date: string;

  @IsString()
  type: string;

  @IsString()
  audienceFocus: string;

  @IsString()
  theme: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsNotEmpty()
  calendarId: string;
}
