import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendPasswordResetDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
