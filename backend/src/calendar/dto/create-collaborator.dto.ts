import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateCollaboratorDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  name?: string;

  @IsIn(['viewer', 'editor', 'admin'])
  @IsNotEmpty()
  role: string;
}
