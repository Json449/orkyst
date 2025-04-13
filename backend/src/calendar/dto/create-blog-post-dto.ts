import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  audienceFocus: string;

  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  // @IsEnum(['Blog Post', 'LinkedIn Post', 'DVC', 'Social Media Post'])
  @IsNotEmpty()
  contentType: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
