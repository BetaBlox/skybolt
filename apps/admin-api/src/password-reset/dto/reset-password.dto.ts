import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
