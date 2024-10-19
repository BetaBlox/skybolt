import { Module } from '@nestjs/common';
import { UsersWidgetService } from '@/widgets/users/users-widget.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersWidgetController } from '@/widgets/users/users-widget.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersWidgetController],
  providers: [UsersWidgetService],
  exports: [UsersWidgetService],
})
export class UsersWidgetModule {}
