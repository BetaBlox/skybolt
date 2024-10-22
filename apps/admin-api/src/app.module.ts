import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ModelsModule } from './models/models.module';
import { RecordsModule } from './records/records.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { SearchModule } from '@/search/search.module';
import { UsersWidgetModule } from '@/widgets/users/users-widget.module';
import { AssetModule } from '@/asset/asset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'admin-client', 'dist'),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PasswordResetModule,
    ModelsModule,
    RecordsModule,
    SearchModule,
    AssetModule,

    // Custom widgets
    UsersWidgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
