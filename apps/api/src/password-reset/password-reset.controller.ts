import { Body, Controller, Post, Req } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { Request } from 'express';
import { PasswordResetDto } from './dto/reset-password.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('/send')
  resetForCurrentUser(
    @Req() req: Request,
    @Body() sendPasswordResetDto: SendPasswordResetDto,
  ) {
    return this.passwordResetService.sendResetEmail(sendPasswordResetDto.email);
  }

  @Post('/reset')
  async reset(@Req() req: Request, @Body() passwordResetDto: PasswordResetDto) {
    return this.passwordResetService.resetPassword(
      passwordResetDto.token,
      passwordResetDto.password,
    );
  }
}
