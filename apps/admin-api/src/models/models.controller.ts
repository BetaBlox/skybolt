import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { AdminModelPayload } from '@repo/types';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getModels(): Promise<AdminModelPayload[]> {
    return this.modelsService.getModels();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:modelName')
  getModel(@Param('modelName') modelName: string): Promise<AdminModelPayload> {
    return this.modelsService.getModel(modelName);
  }
}
