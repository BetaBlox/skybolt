import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelPayload } from '@repo/types/admin';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getModels(): Promise<ModelPayload[]> {
    return this.modelsService.getModels();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:modelName')
  getModel(@Param('modelName') modelName: string): Promise<ModelPayload> {
    return this.modelsService.getModel(modelName);
  }
}
