import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminAttributeType } from '@/config/admin';
import { DMMF } from 'database';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/models')
  getModels(): DMMF.Model[] {
    return this.appService.getModels();
  }

  @Get('/models/:modelName')
  getModel(@Param('modelName') modelName: string): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    count: number;
    records: any[];
  }> {
    return this.appService.getModel(modelName);
  }
}
