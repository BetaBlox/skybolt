import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';
import { AccessTokenStrategy } from '@/auth/accessToken.strategy';
import { RefreshTokenStrategy } from '@/auth/refreshToken.strategy';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [UsersModule, JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
// {
//   provide: APP_GUARD,
//   useClass: AuthGuard,
// },
export class AuthModule {}
