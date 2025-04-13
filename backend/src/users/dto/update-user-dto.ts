// src/users/dto/update-user.dto.ts
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CalendarInputsDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  audience: string;

  @IsNotEmpty()
  @IsString()
  theme: string;

  @IsNotEmpty()
  @IsString()
  contentTypes: string;

  @IsNotEmpty()
  @IsString()
  posting: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CalendarInputsDto)
  calendarInputs: CalendarInputsDto;
}
