import { Controller, Get, Param } from '@nestjs/common';
import { ModelsService } from './models.service';
import { AdminModelPayload } from '@repo/types';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get('/')
  async getModels(): Promise<AdminModelPayload[]> {
    return this.modelsService.getModels();
  }

  @Get('/:modelName')
  getModel(@Param('modelName') modelName: string): Promise<AdminModelPayload> {
    return this.modelsService.getModel(modelName);
  }
}
