import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/auth/auth.service';
import { AuthDto } from '@/auth/dto/auth.dto';
import { RefreshTokenGuard } from '@/common/guards/refreshToken.guard';
import { UsersService } from '@/users/users.service';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    const userId = req.user && req.user['sub'];

    if (userId) {
      this.authService.logout(userId);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.findAdminByEmail(req.user['email']);
    const { password, refreshToken, ...data } = user;
    return data;
  }
}
