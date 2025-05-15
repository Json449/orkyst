// src/users/dto/update-user.dto.ts
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class CalendarInputsDto {
  @IsOptional()
  @IsString()
  whoIsThisFor?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  marketingGoals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  postingFrequency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredContentType?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CalendarInputsDto)
  calendarInputs?: CalendarInputsDto;
}
