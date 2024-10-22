import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
