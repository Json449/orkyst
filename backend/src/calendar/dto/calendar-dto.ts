import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class GenerateCalendarDto {
  @IsNotEmpty()
  @IsString()
  forWhom: string;

  @IsNotEmpty()
  @IsString()
  theme: string;

  @IsNotEmpty()
  @IsString({ each: true })
  contentTypes: string[];

  @IsNotEmpty()
  @IsObject()
  keyDates: {
    productLaunch: string;
    blogPostDue: string;
  };

  @IsNotEmpty()
  @IsString()
  website: string;
}