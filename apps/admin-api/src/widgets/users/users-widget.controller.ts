import {
  Controller,
  UseGuards,
  Body,
  Req,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersWidgetService } from './users-widget.service';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { ChangePasswordDto } from '@/widgets/users/dto/change-password.dto';

@Controller('/widgets/users')
export class UsersWidgetController {
  private readonly logger = new Logger(UsersWidgetController.name);

  constructor(private readonly usersService: UsersWidgetService) {}

  @UseGuards(AccessTokenGuard)
  @Put('/:id/change-password')
  async changePassword(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const adminUserId = req.user['sub'];
    this.logger.log(
      `Admin ${adminUserId} is attempting to change the password for userId ${id}`,
    );

    return this.usersService.changePassword(id, changePasswordDto.newPassword);
  }
}
