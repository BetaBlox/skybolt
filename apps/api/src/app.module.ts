import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'client', 'dist'),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PasswordResetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
