import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class AddFeedbackDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}
