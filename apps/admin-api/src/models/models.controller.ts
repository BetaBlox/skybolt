import { Controller, Get, Param } from '@nestjs/common';
import { ModelsService } from './models.service';
import { AdminAttributeType } from '@/config/admin';
import { DMMF } from 'database';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get('/')
  getModels(): DMMF.Model[] {
    return this.modelsService.getModels();
  }

  @Get('/:modelName')
  getModel(@Param('modelName') modelName: string): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    count: number;
    records: any[];
  }> {
    return this.modelsService.getModel(modelName);
  }
}
