import {
  Controller,
  UseGuards,
  Body,
  Req,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { ChangePasswordDto } from '@/users/dto/change-password.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

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
